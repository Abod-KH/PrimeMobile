import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || '',
    'X-Title': process.env.SITE_NAME || '',
  },
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}