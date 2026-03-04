import { ENHANCEMENT_PROMPTS } from "./prompts";

export interface Intent {
  key: string;
  label: string;
  hasI2i: boolean;
}

export const INTENTS: Intent[] = [
  { key: "ON_BODY_PHOTOREALISTIC",         label: "On-Body Photorealistic",          hasI2i: true  },
  { key: "STUDIO_PRODUCT_PHOTOREALISTIC",  label: "Studio Product Photo",            hasI2i: true  },
  { key: "FLAT_LAY_PHOTOREALISTIC",        label: "Flat Lay Photorealistic",         hasI2i: true  },
  { key: "GHOST_MANNEQUIN_RENDER",         label: "Ghost Mannequin",                 hasI2i: true  },
  { key: "TECHNICAL_SKETCH_BW",            label: "Technical Sketch B&W",            hasI2i: false },
  { key: "STYLE_TO_TECHNICAL_SKETCH",      label: "Style → Technical Sketch",        hasI2i: true  },
  { key: "PRINT_PATTERN_SEAMLESS",         label: "Seamless Print Pattern",          hasI2i: false },
  { key: "GRAPHIC_PLACEMENT_2D",           label: "Graphic Placement 2D",            hasI2i: false },
  { key: "MATERIAL_APPLICATION_TO_SKETCH", label: "Material Application to Sketch",  hasI2i: true  },
  { key: "PRINT_APPLICATION_TO_GARMENT",   label: "Print on Garment",                hasI2i: true  },
  { key: "IMAGE_EDITING_OUTPAINT",         label: "Image Editing / Outpaint",        hasI2i: true  },
  { key: "IMAGE_VARIATION_FROM_REFERENCE", label: "Image Variation from Reference",  hasI2i: true  },
  { key: "OUT_OF_INTENT",                  label: "Out of Intent (Fallback)",        hasI2i: false },
];

export const INTENT_DESCRIPTIONS: Record<string, string> = {
  ON_BODY_PHOTOREALISTIC:         "Photorealistic garment worn by a real human model",
  STUDIO_PRODUCT_PHOTOREALISTIC:  "Isolated garment on a clean studio background, no model",
  FLAT_LAY_PHOTOREALISTIC:        "Garment laid flat, photographed from directly overhead",
  GHOST_MANNEQUIN_RENDER:         "Garment on an invisible body showing fit and cut",
  TECHNICAL_SKETCH_BW:            "B&W flat technical drawing showing construction details",
  STYLE_TO_TECHNICAL_SKETCH:      "Converts a reference image into a clean technical line drawing",
  PRINT_PATTERN_SEAMLESS:         "Seamless tileable fabric print pattern, no garments",
  GRAPHIC_PLACEMENT_2D:           "Flat 2D graphic or placement print design",
  MATERIAL_APPLICATION_TO_SKETCH: "Applies a fabric texture to an existing garment sketch",
  PRINT_APPLICATION_TO_GARMENT:   "Applies a print or pattern to an existing garment image",
  IMAGE_EDITING_OUTPAINT:         "Extends or modifies an existing fashion image",
  IMAGE_VARIATION_FROM_REFERENCE: "Controlled variation from a reference — colour, fabric, styling",
  OUT_OF_INTENT:                  "Request does not match any defined intent",
};

export function resolveIntentKey(baseIntent: string, hasImage: boolean): string {
  const intent = INTENTS.find((i) => i.key === baseIntent);
  if (hasImage && intent?.hasI2i) return `${baseIntent}_i2i`;
  return baseIntent;
}

export function getEnhancementPrompt(intentKey: string): string {
  return (
    ENHANCEMENT_PROMPTS[intentKey] ??
    ENHANCEMENT_PROMPTS[intentKey.replace("_i2i", "")] ??
    ENHANCEMENT_PROMPTS["OUT_OF_INTENT"] ??
    ""
  );
}