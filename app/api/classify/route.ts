import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INTENTS, resolveIntentKey } from "@/lib/intents";

const BASE_KEYS = INTENTS.map((i) => i.key);

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageCount } = await req.json();
    const hasImage = (imageCount ?? 0) > 0;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });

    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const classifyPrompt = `You are an expert at classifying fashion and product image generation requests.

Classify the user's request into EXACTLY ONE intent from the list below.

USER PROMPT: "${prompt}"
USER HAS PROVIDED INPUT IMAGES: ${hasImage} (count: ${imageCount ?? 0})

AVAILABLE INTENTS:
- ON_BODY_PHOTOREALISTIC: garment worn by a real human model, editorial or e-commerce on-body photography
- STUDIO_PRODUCT_PHOTOREALISTIC: isolated garment on clean studio background, no model, product shot
- FLAT_LAY_PHOTOREALISTIC: garment laid flat on a surface, photographed from directly overhead
- GHOST_MANNEQUIN_RENDER: garment on an invisible body showing interior structure, fit, and cut
- TECHNICAL_SKETCH_BW: new B&W flat technical drawing from a text description — seams, pockets, closures
- STYLE_TO_TECHNICAL_SKETCH: convert an existing reference photo or style image into a technical line drawing
- PRINT_PATTERN_SEAMLESS: seamless tileable fabric print or pattern — no garments, no models
- GRAPHIC_PLACEMENT_2D: flat 2D graphic or placement print design, screen print or digital print ready
- MATERIAL_APPLICATION_TO_SKETCH: apply a specified fabric texture to an existing garment sketch
- PRINT_APPLICATION_TO_GARMENT: apply a print or pattern onto an existing garment image
- IMAGE_EDITING_OUTPAINT: extend, expand, replace background, or clean up an existing fashion image
- IMAGE_VARIATION_FROM_REFERENCE: variation of a reference image — changing colour, fabric, or styling while preserving composition
- OUT_OF_INTENT: does not clearly match any of the above

CLASSIFICATION RULES:
- If the user provides an image and wants it converted to a line drawing → STYLE_TO_TECHNICAL_SKETCH
- If the user wants a new sketch from a text description only → TECHNICAL_SKETCH_BW
- If the user wants a garment worn on a person → ON_BODY_PHOTOREALISTIC
- If the user wants a garment shot with no person → STUDIO_PRODUCT_PHOTOREALISTIC
- If the user wants overhead flat garment → FLAT_LAY_PHOTOREALISTIC
- If the user wants invisible mannequin → GHOST_MANNEQUIN_RENDER
- If the user wants a fabric/print pattern with no garment → PRINT_PATTERN_SEAMLESS
- If the user wants a print applied onto a garment → PRINT_APPLICATION_TO_GARMENT
- If the user wants to extend or modify an existing image → IMAGE_EDITING_OUTPAINT
- If the user wants a variation of a reference with specific changes → IMAGE_VARIATION_FROM_REFERENCE
- When in doubt between IMAGE_VARIATION_FROM_REFERENCE and any other intent, prefer the more specific intent

Return ONLY the intent key exactly as written (e.g. "ON_BODY_PHOTOREALISTIC"). No explanation.`;

    const result = await model.generateContent(classifyPrompt);
    const raw = result.response.text().trim().toUpperCase().replace(/\s+/g, "_");
    const baseIntent = BASE_KEYS.includes(raw) ? raw : "OUT_OF_INTENT";
    const intentKey = resolveIntentKey(baseIntent, hasImage);

    return NextResponse.json({ baseIntent, intentKey });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}