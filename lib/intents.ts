export interface Intent {
  key: string;
  label: string;
  group: "garment" | "swatch" | "fallback";
  hasI2i: boolean;
}

export const INTENTS: Intent[] = [
  { key: "FLAT_LAY_PHOTOREALISTIC",        label: "Flat Lay — Photorealistic",       group: "garment",  hasI2i: true  },
  { key: "FLAT_LAY_RENDER",                label: "Flat Lay — CGI Render",           group: "garment",  hasI2i: false },
  { key: "GHOST_MANNEQUIN_RENDER",         label: "Ghost Mannequin",                 group: "garment",  hasI2i: true  },
  { key: "GRAPHIC_PLACEMENT_2D",           label: "Graphic Placement 2D",            group: "garment",  hasI2i: false },
  { key: "IMAGE_EDITING_OUTPAINT",         label: "Image Editing / Outpaint",        group: "garment",  hasI2i: true  },
  { key: "IMAGE_VARIATION_FROM_REFERENCE", label: "Image Variation from Reference",  group: "garment",  hasI2i: true  },
  { key: "MATERIAL_APPLICATION_TO_SKETCH", label: "Material Application to Sketch",  group: "garment",  hasI2i: true  },
  { key: "ON_BODY_PHOTOREALISTIC",         label: "On-Body Photorealistic",          group: "garment",  hasI2i: true  },
  { key: "PRINT_APPLICATION_TO_GARMENT",   label: "Print on Garment",                group: "garment",  hasI2i: true  },
  { key: "PRINT_PATTERN_SEAMLESS",         label: "Seamless Print Pattern",          group: "garment",  hasI2i: false },
  { key: "STUDIO_PRODUCT_PHOTOREALISTIC",  label: "Studio Product Photo",            group: "garment",  hasI2i: true  },
  { key: "STYLE_TO_TECHNICAL_SKETCH",      label: "Style → Technical Sketch",        group: "garment",  hasI2i: true  },
  { key: "TECHNICAL_SKETCH_BW",            label: "Technical Sketch B&W",            group: "garment",  hasI2i: false },
  { key: "SWATCH_BACKGROUND_CHANGE",       label: "Background Change",               group: "swatch",   hasI2i: true  },
  { key: "SWATCH_COLORWAY_INVERT",         label: "Colorway Invert",                 group: "swatch",   hasI2i: true  },
  { key: "SWATCH_COLORWAY_TONAL",          label: "Colorway Tonal",                  group: "swatch",   hasI2i: true  },
  { key: "SWATCH_DENSITY_CHANGE",          label: "Density Change",                  group: "swatch",   hasI2i: true  },
  { key: "SWATCH_DISTRESS_EFFECT",         label: "Distress Effect",                 group: "swatch",   hasI2i: true  },
  { key: "SWATCH_MOTIF_ADD",               label: "Motif Add",                       group: "swatch",   hasI2i: true  },
  { key: "SWATCH_MOTIF_REMOVE",            label: "Motif Remove",                    group: "swatch",   hasI2i: true  },
  { key: "SWATCH_OUTLINE_ADD",             label: "Outline Add",                     group: "swatch",   hasI2i: true  },
  { key: "SWATCH_PLACEMENT_CONVERT",       label: "Placement Convert",               group: "swatch",   hasI2i: true  },
  { key: "SWATCH_RECOLOR",                 label: "Recolor",                         group: "swatch",   hasI2i: true  },
  { key: "SWATCH_REPEAT_TYPE_CHANGE",      label: "Repeat Type Change",              group: "swatch",   hasI2i: true  },
  { key: "SWATCH_RESIZE_ELEMENT",          label: "Resize Element",                  group: "swatch",   hasI2i: true  },
  { key: "SWATCH_SCALE_OVERALL",           label: "Scale Overall",                   group: "swatch",   hasI2i: true  },
  { key: "SWATCH_STYLE_REWORK",            label: "Style Rework",                    group: "swatch",   hasI2i: true  },
  { key: "SWATCH_TEXTURE_OVERLAY",         label: "Texture Overlay",                 group: "swatch",   hasI2i: true  },
  { key: "SWATCH_TILING",                  label: "Tiling",                          group: "swatch",   hasI2i: true  },
  { key: "SWATCH_VARIANT",                 label: "Swatch Variant",                  group: "swatch",   hasI2i: true  },
  { key: "OUT_OF_INTENT",                  label: "Out of Intent",                   group: "fallback", hasI2i: false },
];

export const INTENT_DESCRIPTIONS: Record<string, string> = {
  FLAT_LAY_PHOTOREALISTIC:        "Photorealistic overhead flat lay photo of a garment",
  FLAT_LAY_RENDER:                "CGI/3D rendered flat lay of a garment",
  GHOST_MANNEQUIN_RENDER:         "Ghost/invisible mannequin showing garment shape",
  GRAPHIC_PLACEMENT_2D:           "Graphic/logo placement visualization on a 2D garment template",
  IMAGE_EDITING_OUTPAINT:         "Extending or outpainting an existing image",
  IMAGE_VARIATION_FROM_REFERENCE: "Variation of a reference image with specific changes",
  MATERIAL_APPLICATION_TO_SKETCH: "Applying fabric/material texture to a sketch",
  ON_BODY_PHOTOREALISTIC:         "Photorealistic garment worn by a model",
  PRINT_APPLICATION_TO_GARMENT:   "Applying a print/pattern to a garment",
  PRINT_PATTERN_SEAMLESS:         "Creating a seamless repeat textile print/pattern",
  STUDIO_PRODUCT_PHOTOREALISTIC:  "Clean studio product photography of a fashion item",
  STYLE_TO_TECHNICAL_SKETCH:      "Converting a fashion photo/illustration to a technical flat sketch",
  TECHNICAL_SKETCH_BW:            "Generating a new B&W technical flat sketch from description",
  SWATCH_BACKGROUND_CHANGE:       "Change only the background/ground color of a print swatch",
  SWATCH_COLORWAY_INVERT:         "Swap background and motif colors (invert the color relationship)",
  SWATCH_COLORWAY_TONAL:          "Convert a swatch to a tonal/monochromatic single-hue colorway",
  SWATCH_DENSITY_CHANGE:          "Make a swatch more densely packed or more airy/sparse",
  SWATCH_DISTRESS_EFFECT:         "Add a distressed, aged, or worn effect to a swatch",
  SWATCH_MOTIF_ADD:               "Add a new element/motif to an existing swatch",
  SWATCH_MOTIF_REMOVE:            "Remove a specific element/motif from an existing swatch",
  SWATCH_OUTLINE_ADD:             "Add outlines around motifs in a swatch",
  SWATCH_PLACEMENT_CONVERT:       "Convert a repeat swatch into a single engineered/placement print",
  SWATCH_RECOLOR:                 "Change the color palette or colorway of a print swatch",
  SWATCH_REPEAT_TYPE_CHANGE:      "Change the repeat structure (straight, half-drop, brick, diamond, mirror)",
  SWATCH_RESIZE_ELEMENT:          "Scale a specific motif/element up or down within a print swatch",
  SWATCH_SCALE_OVERALL:           "Scale the entire repeat up or down (macro, medium, ditsy/micro)",
  SWATCH_STYLE_REWORK:            "Re-render a swatch in a different artistic style",
  SWATCH_TEXTURE_OVERLAY:         "Simulate the print on a specific fabric texture",
  SWATCH_TILING:                  "Tile a swatch into a fabric repeat layout (e.g. 3×3, 5×5, diagonal)",
  SWATCH_VARIANT:                 "Generate a thematic variant of an existing print",
  OUT_OF_INTENT:                  "Request does not match any supported fashion image category",
};

// ── Enhancement prompts ────────────────────────────────────────────────────
// Edit these to tune each intent. They are pre-loaded into the UI and are
// fully editable per-session in the Enhancement Instructions panel.
export const ENHANCEMENT_PROMPTS: Record<string, string> = {
  FLAT_LAY_PHOTOREALISTIC: `INTENT: Flat Lay Photorealistic — t2i

Generate a photorealistic overhead flat lay photograph of the described garment.

- Overhead 90-degree bird's-eye perspective, perfectly flat
- Specify surface (marble, white cotton, linen, wood grain, etc.)
- Soft diffused natural lighting with gentle shadow on one side
- Garment laid neatly with all construction details visible
- Professional editorial fashion photography quality`,

  FLAT_LAY_PHOTOREALISTIC_i2i: `INTENT: Flat Lay Photorealistic — i2i

The ONLY change is converting the presentation to a flat lay overhead view.

Always start the enhanced prompt with: "Preserve the garment EXACTLY as shown: same color, same print, same silhouette, same sleeve length, same neckline, same hem, same construction details and hardware. Do NOT alter any garment feature."

Then specify: overhead 90-degree flat lay, surface type, soft upper-left lighting.`,

  FLAT_LAY_RENDER: `INTENT: Flat Lay Render (CGI) — t2i

Generate a CGI/3D rendered flat lay of the described garment.

- Clean digital render quality with sharp geometry
- Overhead 90-degree perspective, perfectly flat
- White or very light neutral background
- Precise fabric simulation with realistic material properties
- Technical accuracy in construction details`,

  GHOST_MANNEQUIN_RENDER: `INTENT: Ghost Mannequin — t2i

Generate a ghost/invisible mannequin image showing the garment's 3D shape.

- Invisible mannequin technique — garment appears to float mid-air
- Front-facing or 3/4 view showing full silhouette
- Clean white or light grey studio background
- Garment fully structured as if worn
- Professional e-commerce quality`,

  GHOST_MANNEQUIN_RENDER_i2i: `INTENT: Ghost Mannequin — i2i

Preserve the garment EXACTLY. Only convert the presentation to ghost mannequin style.

"Preserve the garment EXACTLY: same color, silhouette, all construction details. Do NOT alter any garment feature."

Convert to: invisible/ghost mannequin, clean studio background, garment structured as if worn.`,

  ON_BODY_PHOTOREALISTIC: `INTENT: On-Body Photorealistic — t2i

Generate a photorealistic image of the garment worn by a model.

- Natural editorial lighting — studio or natural daylight
- Model shown from distance that fully displays the garment
- Clean professional fashion photography composition
- Pose that flatters the garment silhouette`,

  ON_BODY_PHOTOREALISTIC_i2i: `INTENT: On-Body Photorealistic — i2i

Preserve the garment EXACTLY as shown. Apply it to a model in a photorealistic scene.

"Preserve the garment EXACTLY: same color, same print, same silhouette, same all construction details. Do NOT alter any garment feature."

Specify: realistic model, appropriate lighting, editorial photography quality.`,

  STUDIO_PRODUCT_PHOTOREALISTIC: `INTENT: Studio Product Photo — t2i

Generate a clean studio product photograph of the fashion item.

- Pure white or seamless light grey studio background
- Professional three-point lighting, minimal shadows
- Item presented at slight angle for depth
- Commercial product photography, sharp focus throughout`,

  STUDIO_PRODUCT_PHOTOREALISTIC_i2i: `INTENT: Studio Product Photo — i2i

Preserve the product EXACTLY. Only convert to clean studio presentation.

"Preserve the item EXACTLY: same color, same material, same all details. Do NOT alter any feature."

Specify: clean white studio background, professional lighting, commercial product photography quality.`,

  PRINT_PATTERN_SEAMLESS: `INTENT: Seamless Print Pattern — t2i

Generate a seamless repeat textile print pattern.

- True seamless tiling — edges must match perfectly on all four sides
- Specify repeat type: straight, half-drop, or brick
- Specify overall scale and density
- Flat graphic representation suitable for textile production
- State the colorway clearly`,

  TECHNICAL_SKETCH_BW: `INTENT: Technical Sketch B&W — t2i

Generate a professional technical flat sketch (CAD/spec drawing).

- Clean black outlines on white background — no shading or fills
- Front view (and back view if requested)
- All construction details: seams, topstitching, pockets, closures, hardware
- Fashion industry standard proportions
- Crisp vector-quality linework appearance`,

  STYLE_TO_TECHNICAL_SKETCH_i2i: `INTENT: Style to Technical Sketch — i2i

Convert the reference image to a clean technical flat sketch/CAD drawing.

"Preserve all construction details of the garment: silhouette, seam lines, pocket placement, closures, hardware. Reproduce them accurately in technical sketch form."

Output: clean B&W technical flat, front view, all details as clean linework on white background.`,

  MATERIAL_APPLICATION_TO_SKETCH_i2i: `INTENT: Material Application to Sketch — i2i

Apply the specified fabric/material texture to the sketch in the reference.

"Preserve the garment silhouette, proportions, and all construction details from the sketch exactly. Only apply the fabric material."

Render the fabric realistically within the sketch outlines.`,

  IMAGE_EDITING_OUTPAINT_i2i: `INTENT: Image Editing / Outpaint — i2i

Extend or expand the reference image as specified.

Preserve the existing image content exactly. Only add new content in the specified areas. Match the lighting, style, and quality of the original seamlessly.`,

  IMAGE_VARIATION_FROM_REFERENCE_i2i: `INTENT: Image Variation from Reference — i2i

Create a variation of the reference image with only the specified change.

"Preserve the overall composition, style, and all elements not mentioned in the change request. Apply ONLY the explicitly requested modification."`,

  PRINT_APPLICATION_TO_GARMENT_i2i: `INTENT: Print on Garment — i2i

Apply the specified print/pattern to the garment in the reference image.

"Preserve the garment silhouette, fit, and all construction details exactly. Only replace the surface print/color with the specified pattern."

Show the print following the garment's drape and construction naturally.`,

  GRAPHIC_PLACEMENT_2D: `INTENT: Graphic Placement 2D — t2i

Generate a 2D garment template visualization showing graphic/logo placement.

- Flat 2D front/back garment outline, no perspective distortion
- Graphic shown at correct scale and position
- Clean presentation-quality layout
- Specify garment type and graphic type clearly`,

  // ── Swatch intents ────────────────────────────────────────────────
  SWATCH_RECOLOR_i2i: `INTENT: Swatch Recolor — i2i

Recolor the swatch to the specified colorway.

"Preserve the exact motif shapes, sizes, layout, density, and repeat structure from the reference. ONLY change the colors."

Apply the new color palette precisely. Do not alter any structural or compositional element.`,

  SWATCH_BACKGROUND_CHANGE_i2i: `INTENT: Swatch Background Change — i2i

Change ONLY the background/ground color of the swatch.

"Preserve all motifs, their colors, sizes, positions, and the entire repeat structure exactly. ONLY change the background/ground color to the specified new color."`,

  SWATCH_COLORWAY_INVERT_i2i: `INTENT: Swatch Colorway Invert — i2i

Swap the background and motif colors.

"Preserve all motif shapes, sizes, and positions exactly. Swap the background and motif colors: the current background color becomes the motif color, and vice versa."`,

  SWATCH_COLORWAY_TONAL_i2i: `INTENT: Swatch Colorway Tonal — i2i

Convert to a tonal/monochromatic single-hue colorway.

"Preserve all motif shapes, sizes, positions, and repeat structure. Convert the entire colorway to variations of a single hue, from light tint to deep shade."`,

  SWATCH_DENSITY_CHANGE_i2i: `INTENT: Swatch Density Change — i2i

Change the density/spacing of the motifs. This is a STRUCTURAL change — allow layout regeneration.

Favor a clearly visible transformation. If increasing density: pack motifs visibly closer. If decreasing: add significantly more negative space between motifs.`,

  SWATCH_DISTRESS_EFFECT_i2i: `INTENT: Swatch Distress Effect — i2i

Add a distressed/aged effect to the swatch.

"Preserve the motif layout and colors. Add [distress type: worn edges, faded areas, cracked texture, ink bleed, etc.] effect authentically across the swatch."`,

  SWATCH_MOTIF_ADD_i2i: `INTENT: Swatch Motif Add — i2i

Add the specified new motif to the swatch.

"Preserve all existing motifs, colors, and repeat structure exactly. Add the new motif in a style consistent with the existing design, integrating it naturally into the composition."`,

  SWATCH_MOTIF_REMOVE_i2i: `INTENT: Swatch Motif Remove — i2i

Remove the specified motif from the swatch.

"Preserve all remaining motifs, colors, and repeat structure exactly. Remove the specified motif cleanly, filling the space with the background color/texture seamlessly."`,

  SWATCH_OUTLINE_ADD_i2i: `INTENT: Swatch Outline Add — i2i

Add outlines around motifs in the swatch.

"Preserve all motif shapes, colors, positions, and repeat structure. Add a clean outline of the specified color and thickness around each motif."`,

  SWATCH_PLACEMENT_CONVERT_i2i: `INTENT: Swatch Placement Convert — i2i

Convert the repeat swatch into a single engineered/placement print. This is a STRUCTURAL change — allow full composition redesign.

Create a single, non-repeating placement print composition using the motifs from the swatch reference.`,

  SWATCH_REPEAT_TYPE_CHANGE_i2i: `INTENT: Swatch Repeat Type Change — i2i

Change the repeat structure of the swatch. This is a STRUCTURAL change — allow layout regeneration.

Convert to the specified repeat type (straight / half-drop / brick / diamond / mirror). Maintain all motifs, colors, and scale. Make the new repeat structure clearly visible.`,

  SWATCH_RESIZE_ELEMENT_i2i: `INTENT: Swatch Resize Element — i2i

Resize a specific motif/element within the swatch. This is a STRUCTURAL change — allow layout regeneration.

"Preserve all other motifs, colors, and overall repeat structure. Make the specified motif larger/smaller by the described amount. Adjust surrounding composition as needed."`,

  SWATCH_SCALE_OVERALL_i2i: `INTENT: Swatch Scale Overall — i2i

Scale the entire repeat pattern up or down. This is a STRUCTURAL change — allow layout regeneration.

Scale ALL motifs to the target scale (macro / medium / ditsy-micro). Maintain all colors, motif shapes, and relative proportions. Make the scale change clearly visible.`,

  SWATCH_STYLE_REWORK_i2i: `INTENT: Swatch Style Rework — i2i

Re-render the swatch in a different artistic style.

"Preserve the motif subjects, layout, and colorway. Convert the rendering style to the specified style (watercolor / flat graphic / linocut / screen print / painterly / etc.)."`,

  SWATCH_TEXTURE_OVERLAY_i2i: `INTENT: Swatch Texture Overlay — i2i

Simulate the swatch print on a specific fabric texture.

"Preserve the print design, colors, and layout exactly. Apply the specified fabric texture (linen / denim / silk charmeuse / cotton voile / etc.) over the print realistically."`,

  SWATCH_TILING_i2i: `INTENT: Swatch Tiling — i2i

Tile the swatch into a fabric repeat layout.

"Take the reference swatch tile and repeat it the specified number of times (e.g. 3×3) in the specified grid (straight / diagonal / brick). Maintain exact colors and print fidelity across all tiles."`,

  SWATCH_VARIANT_i2i: `INTENT: Swatch Variant — i2i

Generate a thematic variant of the swatch.

"Using the reference swatch as the design family and style guide, create a new variant with the specified variation (different elements, different arrangement, same spirit). Maintain the same artistic style, scale, and colorway unless otherwise specified."`,

  OUT_OF_INTENT: `INTENT: Out of Intent

The request does not clearly match a specific fashion image intent.

Enhance with general professional image generation best practices:
- Be specific about style, lighting, and composition
- Specify relevant technical details
- Aim for professional quality output`,
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
