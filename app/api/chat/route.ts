import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env['GITHUB_TOKEN'],
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}