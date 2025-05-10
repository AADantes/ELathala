import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Set this in your .env.local

export async function POST(req: NextRequest) {
  const { prompt, explain } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  // Compose a smart prompt for the AI
  const systemPrompt = `
You are an expert writing assistant. Given a writing prompt, analyze it and return:
- The most accurate genre (e.g. Fantasy, Sci-Fi, Romance, Mystery, Horror, Adventure, Historical, Drama, Comedy, Non-fiction, etc.)
- The main topic (e.g. Love, War, Friendship, Magic, Technology, Crime, Family, Courage, Betrayal, Survival, etc.)
${explain ? "- A short explanation for your choices." : ""}
Respond in JSON like: {"genre":"...", "topic":"...", "confidence":0.95, "explanation":"..."}
If unsure, make your best guess.
`;

  // Call OpenRouter (GPT-4o, free tier available, see openrouter.ai)
  const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 256,
      temperature: 0.2,
    }),
  });

  const aiData = await aiRes.json();
  let result = null;
  try {
    // Try to extract JSON from the AI's response
    const match = aiData.choices?.[0]?.message?.content?.match(/\{[\s\S]*\}/);
    result = match ? JSON.parse(match[0]) : null;
  } catch (e) {}

  if (!result) {
    return NextResponse.json({ error: "AI could not analyze the prompt." }, { status: 500 });
  }

  return NextResponse.json(result);
}