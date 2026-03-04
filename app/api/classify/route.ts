import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INTENTS, INTENT_DESCRIPTIONS, resolveIntentKey } from "@/lib/intents";

const BASE_KEYS = INTENTS.map((i) => i.key);

export async function POST(req: NextRequest) {
  try {
    const { prompt, hasImage } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });

    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const intentList = BASE_KEYS.map((k) => `- ${k}: ${INTENT_DESCRIPTIONS[k] ?? ""}`).join("\n");

    const classifyPrompt = `You are an expert at classifying fashion and product image generation requests.

Classify the user's request into EXACTLY ONE intent from the list below.

USER PROMPT: "${prompt}"
USER HAS PROVIDED AN INPUT IMAGE: ${hasImage}

AVAILABLE INTENTS:
${intentList}

CLASSIFICATION RULES:
- FLAT_LAY_PHOTOREALISTIC: photographic-style flat lay shot on a real surface
- FLAT_LAY_RENDER: CGI/rendered/digital flat lay
- GHOST_MANNEQUIN_RENDER: invisible/ghost mannequin presentation
- GRAPHIC_PLACEMENT_2D: logo, graphic, or text placement on a garment template
- IMAGE_EDITING_OUTPAINT: extend, expand, or fill a region of an image
- IMAGE_VARIATION_FROM_REFERENCE: changed version of a reference — NOT a swatch-specific operation
- MATERIAL_APPLICATION_TO_SKETCH: user has a sketch, wants fabric/material applied
- ON_BODY_PHOTOREALISTIC: garment shown being worn on a model/person
- PRINT_APPLICATION_TO_GARMENT: specific print or pattern placed onto a garment
- PRINT_PATTERN_SEAMLESS: create a brand-new seamless repeat pattern from scratch
- STUDIO_PRODUCT_PHOTOREALISTIC: clean studio product shot (no model)
- STYLE_TO_TECHNICAL_SKETCH: convert existing fashion image into technical linework
- TECHNICAL_SKETCH_BW: new technical flat sketch from a text description
- SWATCH_BACKGROUND_CHANGE: change only the background/ground color of a swatch
- SWATCH_COLORWAY_INVERT: swap background and motif colors
- SWATCH_COLORWAY_TONAL: convert to single-hue tonal/monochromatic palette
- SWATCH_DENSITY_CHANGE: motifs more packed or more spread out/airy
- SWATCH_DISTRESS_EFFECT: worn, aged, faded, or distressed look on a swatch
- SWATCH_MOTIF_ADD: add a new element or motif to an existing swatch
- SWATCH_MOTIF_REMOVE: remove a specific element from an existing swatch
- SWATCH_OUTLINE_ADD: outlines added around motifs in a swatch
- SWATCH_PLACEMENT_CONVERT: convert repeat swatch into a placement/engineered print
- SWATCH_RECOLOR: change the colors or colorway of a swatch
- SWATCH_REPEAT_TYPE_CHANGE: change the repeat structure (half-drop, brick, diamond, etc.)
- SWATCH_RESIZE_ELEMENT: a specific motif/element made larger or smaller
- SWATCH_SCALE_OVERALL: entire repeat scaled up (larger motifs) or down (smaller/ditsy)
- SWATCH_STYLE_REWORK: swatch re-rendered in a different artistic style
- SWATCH_TEXTURE_OVERLAY: how a swatch looks on a specific fabric texture
- SWATCH_TILING: swatch tiled into a fabric repeat (3x3, 5x5, diagonal, etc.)
- SWATCH_VARIANT: thematic variation of an existing swatch (same family, different elements)
- OUT_OF_INTENT: none of the above clearly applies

SWATCH INTENT PRIORITY: If the user mentions "swatch", "print", "pattern", or "fabric tile" AND wants to modify it, always prefer a SWATCH_ intent over IMAGE_VARIATION_FROM_REFERENCE.

Return ONLY the intent key exactly as written. No explanation.`;

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
