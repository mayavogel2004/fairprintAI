import { NextRequest } from "next/server";
import OpenAI from "openai";

export const maxDuration = 45;

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OpenAI API key not configured.", { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: { image: string; mimeType: string; documentType: string };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const { image, mimeType, documentType } = body;
  if (!image || !mimeType) {
    return new Response("Missing image or mimeType.", { status: 400 });
  }

  const docLabel =
    documentType === "medical_bill" ? "medical bill"
    : documentType === "insurance_denial" ? "insurance denial letter"
    : documentType === "lease" ? "rental lease"
    : "document";

  const systemPrompt = `You are FairPrint AI, an expert document auditor specializing in medical billing fraud, insurance denials, and predatory lease clauses. You are reviewing a ${docLabel} that a patient just uploaded.

Narrate your review out loud, speaking directly to the patient in second person ("I can see...", "Your bill shows...", "There's a charge here for..."). Sound like a sharp consultant who is actively scanning and thinking.

Structure your narration like this:
1. First, identify what you're looking at (provider name, date, type of document)
2. Scan the charges or clauses one by one — name specific items you see
3. Flag anything suspicious immediately as you encounter it ("Wait — this charge appears twice...", "This amount is significantly above national average...")
4. End with a brief preview of what the full analysis will uncover

Keep it to 3-4 paragraphs, conversational but authoritative. No bullet points. No headers. Just flowing expert narration. Start immediately — no preamble.`;

  try {
    const stream = openai.chat.completions.stream({
      model: "gpt-4o",
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Review this document now." },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return new Response("Streaming analysis failed.", { status: 500 });
  }
}
