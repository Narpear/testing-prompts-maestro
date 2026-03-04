# Maestro Intent Lab — Web App

Next.js web interface for the Maestro fashion image generation pipeline.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # paste your GEMINI_API_KEY
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import project on vercel.com
3. Add `GEMINI_API_KEY` in **Settings → Environment Variables**
4. Deploy

## Customising enhancement prompts

All prompts live in `lib/intents.ts` inside the `ENHANCEMENT_PROMPTS` object.  
Each key maps to an intent key (e.g. `FLAT_LAY_PHOTOREALISTIC_i2i`, `SWATCH_RECOLOR_i2i`).  
You can also edit them live in the UI — the Enhancement Instructions panel is fully editable per session.
