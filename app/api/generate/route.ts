import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { enhancedPrompt, inputImageBase64 } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });

    const hasImage = !!inputImageBase64;
    const parts: object[] = [];

    if (hasImage) {
      const raw = inputImageBase64.includes(",") ? inputImageBase64.split(",")[1] : inputImageBase64;
      const mimeType = inputImageBase64.startsWith("data:image/png")
        ? "image/png"
        : inputImageBase64.startsWith("data:image/webp")
        ? "image/webp"
        : "image/jpeg";
      parts.push({ inline_data: { mime_type: mimeType, data: raw } });
    }

    parts.push({ text: enhancedPrompt });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: { responseModalities: ["Text", "Image"] },
        }),
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Gemini error ${res.status}: ${txt}` }, { status: res.status });
    }

    const data = await res.json();
    const responseParts = data?.candidates?.[0]?.content?.parts ?? [];

    let imageBase64: string | null = null;
    let mimeType = "image/png";
    for (const p of responseParts) {
      if (p.inlineData?.data) {
        imageBase64 = p.inlineData.data;
        mimeType = p.inlineData.mimeType ?? "image/png";
        break;
      }
    }

    if (!imageBase64) {
      return NextResponse.json({ error: "Gemini returned no image. Check API quota or prompt." }, { status: 500 });
    }

    return NextResponse.json({ imageBase64, mimeType, mode: hasImage ? "i2i" : "t2i" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
