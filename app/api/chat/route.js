import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withRateLimit } from '../../middleware/rateLimit';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

// Load system prompt from file (once at startup)
const PROMPT_PATH = path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md');
let SYSTEM_PROMPT = '';
try {
  SYSTEM_PROMPT = fs.readFileSync(PROMPT_PATH, 'utf-8');
} catch (e) {
  console.error('Failed to load system prompt:', e);
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

function normalizeHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  return rawHistory.slice(-20).map((item) => {
    const role = item?.role === 'model' ? 'model' : 'user';
    const partsArray = Array.isArray(item?.parts) ? item.parts : [];
    const parts = partsArray.map((p) => (typeof p === 'string' ? { text: p } : p)).filter(Boolean);
    return { role, parts };
  });
}

async function handler(request) {
  try {
    if (!genAI || !GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }

    const body = await request.json();
    const message = body?.message;
    const history = body?.history || [];

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: SYSTEM_PROMPT || undefined,
    });

    const chatHistory = normalizeHistory(history);

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const replyText = result?.response?.text?.() ?? '';

    const updated_history = [
      ...history,
      { role: 'user', parts: [message] },
      { role: 'model', parts: [replyText] },
    ].slice(-24);

    return NextResponse.json({
      status: 'success',
      reply: replyText,
      updated_history,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      status: 'error',
      reply: 'Произошла внутренняя ошибка. Команда уже уведомлена.',
      updated_history: [],
    }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, 'ai');

