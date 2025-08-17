import { NextResponse } from 'next/server';
import { withRateLimit } from '../../middleware/rateLimit';

const MAX_REQUEST_SIZE = 16 * 1024; // ~16KB

async function sendTelegram(text) {
	try {
		if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
		await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: process.env.TELEGRAM_CHAT_ID,
				text,
				parse_mode: 'HTML'
			})
		});
	} catch (e) {
		console.error('Feedback Telegram error:', e);
	}
}

async function handler(request) {
	try {
		const len = Number(request.headers.get('content-length') || 0);
		if (len > MAX_REQUEST_SIZE) {
			return NextResponse.json({ error: 'Слишком большой запрос' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
		}

		const { rating, comment = '', context = {} } = await request.json();

		// Validate rating 1..5
		const num = Number(rating);
		if (!Number.isFinite(num) || num < 1 || num > 5) {
			return NextResponse.json({ error: 'Некорректная оценка' }, { status: 422, headers: { 'Cache-Control': 'no-store' } });
		}

		if (typeof comment !== 'string' || comment.length > 1000) {
			return NextResponse.json({ error: 'Слишком длинный комментарий' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
		}

		// Basic message
		const message = `⭐ <b>Новая обратная связь</b>\n\n` +
			`Оценка: ${num}/5\n` +
			`Комментарий: ${comment || '—'}\n` +
			`Контекст: ${Object.keys(context).length ? JSON.stringify(context, null, 2) : '—'}\n` +
			`Время: ${new Date().toLocaleString('ru-RU')}`;

		sendTelegram(message).catch(console.error);

		return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
	} catch (error) {
		console.error('Feedback API error:', error);
		return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
	}
}

export const POST = withRateLimit(handler, 'contact');