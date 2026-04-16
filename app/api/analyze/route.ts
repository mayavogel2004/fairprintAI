import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/prompts";

export const maxDuration = 60; // Allow up to 60s for GPT-4 Vision

type DocumentType = "medical_bill" | "insurance_denial" | "lease" | "other";

interface AnalyzeRequestBody {
  image: string;      // base64-encoded image data (without data: prefix)
  mimeType: string;   // e.g., "image/jpeg"
  documentType: DocumentType;
  fileName?: string;
}

export async function POST(request: NextRequest) {
  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env.local file." },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: AnalyzeRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { image, mimeType, documentType } = body;

  if (!image || !mimeType || !documentType) {
    return NextResponse.json(
      { error: "Missing required fields: image, mimeType, documentType." },
      { status: 400 }
    );
  }

  // Validate document type
  const validTypes: DocumentType[] = ["medical_bill", "insurance_denial", "lease", "other"];
  if (!validTypes.includes(documentType)) {
    return NextResponse.json({ error: "Invalid document type." }, { status: 400 });
  }

  // Validate MIME type
  const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  const normalizedMime = mimeType.toLowerCase();
  if (!validMimes.some((m) => normalizedMime.includes(m.split("/")[1]))) {
    // For PDFs or unsupported types, return a helpful error
    if (normalizedMime.includes("pdf")) {
      return NextResponse.json(
        {
          error:
            "PDF files must be converted to an image before analysis. Please take a screenshot or use an online PDF-to-image converter.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: `Unsupported file type: ${mimeType}. Please upload a JPG, PNG, or WEBP image.` },
      { status: 400 }
    );
  }

  const systemPrompt = getSystemPrompt(documentType);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this ${documentType.replace("_", " ")} document. Look carefully at every line item, charge, clause, or term visible. Be thorough and specific. Return your analysis as valid JSON only — no markdown code blocks, no extra text.`,
            },
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
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { error: "Could not parse AI response. Please try again." },
          { status: 500 }
        );
      }
      result = JSON.parse(jsonMatch[0]);
    }

    // Ensure required fields exist with fallbacks
    if (!result.summary) result.summary = "Analysis complete. See red flags and battle plan below.";
    if (!Array.isArray(result.redFlags)) result.redFlags = [];
    if (!Array.isArray(result.battlePlan)) result.battlePlan = [];
    if (!result.disputeLetter) result.disputeLetter = "Unable to generate dispute letter. Please try again.";

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("OpenAI API error:", err);

    // Handle specific OpenAI errors
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Check your OPENAI_API_KEY environment variable." },
          { status: 500 }
        );
      }
      if (err.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (err.status === 400) {
        return NextResponse.json(
          {
            error:
              "The image could not be processed. Make sure it is a clear, readable photo and try again.",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
