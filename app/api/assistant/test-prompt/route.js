import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const PROMPT_PATH = path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md');
    
    let fileExists = false;
    let promptContent = '';
    let error = null;
    
    try {
      fileExists = fs.existsSync(PROMPT_PATH);
      if (fileExists) {
        promptContent = fs.readFileSync(PROMPT_PATH, 'utf-8');
      }
    } catch (e) {
      error = e.message;
    }
    
    return NextResponse.json({
      success: true,
      fileExists,
      promptPath: PROMPT_PATH,
      currentWorkingDir: process.cwd(),
      promptLength: promptContent.length,
      promptPreview: promptContent.substring(0, 500),
      error: error || null,
      env: {
        hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
        geminiKeyLength: process.env.GOOGLE_GEMINI_API_KEY ? process.env.GOOGLE_GEMINI_API_KEY.length : 0,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}