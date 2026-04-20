import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 20;

interface DecodeRequestBody {
  query: string; // CPT code, billing term, insurance jargon, etc.
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured." },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: DecodeRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { query } = body;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "Please provide a term or code to decode." }, { status: 400 });
  }

  if (query.trim().length > 200) {
    return NextResponse.json({ error: "Query too long. Keep it under 200 characters." }, { status: 400 });
  }

  const systemPrompt = `You are a medical billing and insurance expert who explains complex terms in plain English for everyday patients.

When given a CPT code, ICD-10 code, insurance term, medical billing jargon, or legal/lease term, you respond with a JSON object in this exact format:
{
  "term": "the original term or code",
  "plainEnglish": "1-2 sentence plain English explanation of what this is",
  "category": "one of: CPT Code | ICD Code | Insurance Term | Billing Term | Legal/Lease Term | Drug | Other",
  "typicalCost": "typical price range if applicable, e.g. '$200 - $800' — use null if not applicable",
  "watchOut": "one specific red flag or thing the patient should know, or null if none",
  "isCommon": true or false (is this a commonly seen term on bills/documents?)
}

Be empathetic and use language a patient would understand, not medical jargon. If the term is legitimately benign, say so reassuringly. If it's something that could be disputed or is often overcharged, flag it clearly.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 400,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Decode this for me: "${query.trim()}"`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 500 });
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Decode API error:", err);

    if (err instanceof OpenAI.APIError && err.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
