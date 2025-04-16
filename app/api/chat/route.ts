import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env["GITHUB_TOKEN"],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { messages } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
