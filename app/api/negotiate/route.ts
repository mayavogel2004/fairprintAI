import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;

interface NegotiateMessage {
  role: "user" | "assistant";
  content: string;
}

interface NegotiateRequest {
  messages: NegotiateMessage[];
  analysisContext: string;
  documentType: string;
  scenario: string; // e.g. "billing_department", "insurance_appeals"
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured." }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: NegotiateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, analysisContext, documentType, scenario } = body;

  const scenarioLabel =
    scenario === "insurance_appeals"
      ? "insurance company appeals specialist"
      : scenario === "supervisor"
      ? "billing department supervisor"
      : "hospital billing department representative";

  const docLabel =
    documentType === "medical_bill" ? "medical bill"
    : documentType === "insurance_denial" ? "insurance denial"
    : documentType === "lease" ? "rental lease dispute"
    : "billing dispute";

  const systemPrompt = `You are roleplaying as "Alex," a ${scenarioLabel} at a healthcare organization. You are speaking with a patient about their ${docLabel}.

CONTEXT — the document being disputed:
${analysisContext}

YOUR CHARACTER:
- Start resistant and procedural ("That's just our standard billing", "I'll need to review that")
- Gradually become more cooperative when the patient makes specific, well-reasoned arguments
- React authentically to references to laws (No Surprises Act, ERISA, state billing regulations)
- Get more cooperative when patient mentions they have documentation, want to speak to a supervisor, or will file a complaint
- Be realistic — sometimes make partial concessions ("I can review that specific line item")
- Difficulty level: medium (not a pushover, but not impossible)

RESPONSE FORMAT — respond ONLY with valid JSON in this exact structure, no markdown, no code blocks:
{
  "billingRep": "Your in-character response as Alex (2-4 sentences, realistic and conversational)",
  "coaching": "One specific tip for the patient's next move (1-2 sentences)",
  "phase": "opening|building|pressing|closing",
  "concessionMade": true or false,
  "concessionDetail": "brief description if concessionMade is true, otherwise null",
  "powerMoveAvailable": "A strong argument or tactic the patient could use right now"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "Empty response." }, { status: 500 });

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Negotiate API error:", err);
    if (err instanceof OpenAI.APIError && err.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a moment." }, { status: 429 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
