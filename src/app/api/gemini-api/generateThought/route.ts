import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import supabase from '../../../../../config/supabaseClient';

export async function POST(request: Request) {
  try {
    const { text, userID } = await request.json();

    if (!text || !userID) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent([
  { text: `Generate a brief thought analysis about the text: ${text}` }
]);

const response = await result.response;
const analysis = await response.text();

    const { error: usageError } = await supabase.from('gemini_api_usage').insert([
      { user_id: userID }
    ]);

    if (usageError) {
      console.error("Failed to log usage:", usageError.message);
    }

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Error during analysis:", error);
    return NextResponse.json({ error: "Something went wrong during the analysis." }, { status: 500 });
  }
}
