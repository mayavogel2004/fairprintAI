import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  analysisContext: string; // JSON string of the analysis result
  documentType: string;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured." },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, analysisContext, documentType } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Missing messages array." }, { status: 400 });
  }

  const docLabel =
    documentType === "medical_bill" ? "medical bill"
    : documentType === "insurance_denial" ? "insurance denial letter"
    : documentType === "lease" ? "rental lease"
    : "document";

  const systemPrompt = `You are FairPrint AI, a knowledgeable document advocate and patient billing expert. You have just analyzed a ${docLabel} for a user and provided them with a full report including red flags and a dispute letter.

Here is the complete analysis you performed:
${analysisContext}

Your role now is to answer the user's follow-up questions about this specific document. Be:
- Specific: reference actual charges, clauses, or findings from the analysis above
- Actionable: give concrete next steps when asked
- Empowering: help the user understand their rights and how to fight back
- Concise: keep answers focused and clear (2-4 paragraphs max)

You are NOT a lawyer. Always note that for legal advice they should consult a professional. But you CAN explain billing codes, insurance terms, dispute processes, and what is/isn't normal.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Chat API error:", err);

    if (err instanceof OpenAI.APIError) {
      if (err.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (err.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
