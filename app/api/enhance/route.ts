import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const STRUCTURAL = new Set([
  "SWATCH_RESIZE_ELEMENT",
  "SWATCH_DENSITY_CHANGE",
  "SWATCH_SCALE_OVERALL",
  "SWATCH_REPEAT_TYPE_CHANGE",
  "SWATCH_PLACEMENT_CONVERT",
]);

export async function POST(req: NextRequest) {
  try {
    const { userPrompt, intentKey, enhancementInstructions } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });

    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const isI2i = intentKey.endsWith("_i2i");
    const base = intentKey.replace("_i2i", "");

    const preservationNote =
      isI2i && !STRUCTURAL.has(base)
        ? `\nCRITICAL: This is an image-to-image task. Preserve original layout, proportions, motif placement, and structure. Only apply the explicitly requested surface-level change.`
        : "";

    const structuralNote =
      isI2i && STRUCTURAL.has(base)
        ? `\nIMPORTANT: This is a structural pattern change. Favor a clearly visible, bold transformation. Allow layout regeneration if required.`
        : "";

    const fullPrompt = `You are an expert prompt engineer for AI image generation, specialising in fashion and product imagery.

Rewrite and expand the user's raw prompt into a precise, effective image generation prompt.
Follow the enhancement instructions strictly.

DETECTED INTENT: ${intentKey}

ENHANCEMENT INSTRUCTIONS:
${enhancementInstructions}
${structuralNote}
${preservationNote}

USER'S ORIGINAL PROMPT:
"${userPrompt}"

RULES:
1. Preserve the user's core request — do not change what they want, only clarify or strengthen it.
2. Fill in reasonable professional defaults for unspecified details.
3. If the user specifies colors or materials, keep them exactly.
4. Do NOT over-constrain structural changes with preservation language.
5. Output ONLY the enhanced prompt — no explanation, no labels, no preamble.

ENHANCED PROMPT:`;

    const result = await model.generateContent(fullPrompt);
    return NextResponse.json({ enhanced: result.response.text().trim() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
