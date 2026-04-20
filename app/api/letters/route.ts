import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

interface LettersRequest {
  analysisContext: string;
  documentType: string;
  recipientType?: string; // "hospital", "insurance", "landlord"
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured." }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: LettersRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { analysisContext, documentType, recipientType } = body;

  const recipient =
    recipientType === "insurance" ? "insurance company"
    : recipientType === "landlord" ? "landlord/property manager"
    : documentType === "lease" ? "landlord/property manager"
    : documentType === "insurance_denial" ? "insurance company"
    : "hospital/provider billing department";

  const systemPrompt = `You are a professional patient advocate and medical billing attorney drafting a 3-letter dispute sequence for a patient.

Based on this document analysis:
${analysisContext}

Generate exactly 3 escalating dispute letters addressed to the ${recipient}. Each letter should be progressively firmer.

Return ONLY valid JSON with this structure (no markdown, no code blocks):
{
  "initial": {
    "subject": "Re: Dispute of [Document Type] — Account #[ACCOUNT]",
    "tone": "Professional and polite",
    "body": "Full letter text here. Use [PATIENT NAME], [DATE], [ACCOUNT NUMBER] as placeholders where appropriate. Include specific charges and violations from the analysis. Reference relevant laws. Request specific actions with a 30-day response deadline. Sign as [PATIENT NAME]."
  },
  "followUp": {
    "subject": "FOLLOW-UP: Unresolved Dispute — Account #[ACCOUNT] — 30 Days Outstanding",
    "tone": "Firm and assertive",
    "body": "Full letter text. Reference the initial letter dated [INITIAL DATE]. Note the lack of response. Escalate the tone. Mention right to file complaints with state insurance commissioner or CMS. Give 14-day deadline. Reference federal protections more explicitly."
  },
  "finalNotice": {
    "subject": "FINAL NOTICE: Legal Action Pending — Account #[ACCOUNT]",
    "tone": "Very firm — legal language",
    "body": "Full letter text. Reference both prior letters. State that if not resolved within 10 days you will: (1) file complaints with relevant regulatory bodies, (2) engage legal counsel, (3) report to credit bureaus if applicable. Include specific dollar amounts in dispute. Demand written response."
  }
}

Make the letters specific to the actual violations found in the analysis. Each letter body should be 3-5 paragraphs. Professional formatting with date, address blocks, and signature line.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 3000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the 3-letter dispute sequence now." },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "Empty response." }, { status: 500 });

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Letters API error:", err);
    if (err instanceof OpenAI.APIError && err.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a moment." }, { status: 429 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
