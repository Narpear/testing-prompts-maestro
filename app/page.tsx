"use client";

import { useState, useRef, useCallback } from "react";
import {
  INTENTS,
  INTENT_DESCRIPTIONS,
  getEnhancementPrompt,
  resolveIntentKey,
} from "@/lib/intents";

type Mode = "text" | "image";
type Step = "idle" | "classifying" | "enhancing" | "generating" | "done" | "error";

interface RunState {
  step: Step;
  baseIntent: string;
  intentKey: string;
  enhancedPrompt: string;
  outputSrc: string;
  error: string;
}

const INITIAL: RunState = {
  step: "idle", baseIntent: "", intentKey: "",
  enhancedPrompt: "", outputSrc: "", error: "",
};

const STEP_LABEL: Record<Step, string> = {
  idle: "", classifying: "Classifying…", enhancing: "Enhancing…",
  generating: "Generating…", done: "Done", error: "Error",
};

export default function Page() {
  const [mode, setMode]                   = useState<Mode>("text");
  const [userPrompt, setUserPrompt]       = useState("");
  const [enhancement, setEnhancement]     = useState("");
  const [selectedBase, setSelectedBase]   = useState("");
  const [override, setOverride]           = useState(false);
  const [inputImg, setInputImg]           = useState<string | null>(null);
  const [isDragging, setIsDragging]       = useState(false);
  const [run, setRun]                     = useState<RunState>(INITIAL);
  const fileRef                           = useRef<HTMLInputElement>(null);

  const loadEnhancement = useCallback((intentKey: string) => {
    setEnhancement(getEnhancementPrompt(intentKey));
  }, []);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setInputImg(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setInputImg(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleIntentOverride = (base: string) => {
    setSelectedBase(base);
    setOverride(!!base);
    if (base) {
      const resolved = resolveIntentKey(base, mode === "image" && !!inputImg);
      loadEnhancement(resolved);
    }
  };

  const handleRun = async () => {
    if (!userPrompt.trim()) return;
    const hasImage = mode === "image" && !!inputImg;

    setRun({ ...INITIAL, step: "classifying" });

    try {
      // 1 — Classify
      let baseIntent = selectedBase;
      let intentKey  = selectedBase ? resolveIntentKey(selectedBase, hasImage) : "";

      if (!override || !selectedBase) {
        const r = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt, hasImage }),
        });
        const d = await r.json();
        if (d.error) throw new Error(d.error);
        baseIntent = d.baseIntent;
        intentKey  = d.intentKey;
        setSelectedBase(baseIntent);
        loadEnhancement(intentKey);
        await new Promise((res) => setTimeout(res, 80));
      }

      setRun((p) => ({ ...p, step: "enhancing", baseIntent, intentKey }));

      // 2 — Enhance
      const instructions = enhancement || getEnhancementPrompt(intentKey);
      const er = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt, intentKey, enhancementInstructions: instructions }),
      });
      const ed = await er.json();
      if (ed.error) throw new Error(ed.error);

      setRun((p) => ({ ...p, step: "generating", enhancedPrompt: ed.enhanced }));

      // 3 — Generate
      const gr = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enhancedPrompt: ed.enhanced, inputImageBase64: hasImage ? inputImg : null }),
      });
      const gd = await gr.json();
      if (gd.error) throw new Error(gd.error);

      setRun((p) => ({
        ...p,
        step: "done",
        outputSrc: `data:${gd.mimeType};base64,${gd.imageBase64}`,
      }));
    } catch (err) {
      setRun((p) => ({ ...p, step: "error", error: String(err) }));
    }
  };

  const downloading = () => {
    if (!run.outputSrc) return;
    const a = document.createElement("a");
    a.href = run.outputSrc;
    a.download = `maestro_${run.intentKey}_${Date.now()}.png`;
    a.click();
  };

  const isRunning = ["classifying", "enhancing", "generating"].includes(run.step);
  const hasResult = run.step === "done";
  const hasImage  = mode === "image" && !!inputImg;
  const resolvedSelected = selectedBase ? resolveIntentKey(selectedBase, hasImage) : "";

  const grouped = {
    main:     INTENTS.filter((i) => i.key !== "OUT_OF_INTENT"),
    fallback: INTENTS.filter((i) => i.key === "OUT_OF_INTENT"),
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Header ── */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--card)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: 18, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              Maestro Intent Lab
            </span>
            <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "'JetBrains Mono'", letterSpacing: "0.04em" }}>
              v2
            </span>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 99, background: "var(--bg)", border: "1px solid var(--border)" }}>
            {(["text", "image"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); if (m === "text") clearImage(); }}
                style={{
                  padding: "5px 16px", borderRadius: 99, fontSize: 12, fontFamily: "'DM Sans'",
                  background: mode === m ? "var(--card)" : "transparent",
                  color: mode === m ? "var(--ink)" : "var(--ink-muted)",
                  border: mode === m ? "1px solid var(--border)" : "1px solid transparent",
                  boxShadow: mode === m ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                {m === "text" ? "Text only" : "Image + Text"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 32px 48px" }}>

        {/* ── Row 1: Images ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mode === "image" ? "1fr 48px 1fr" : "1fr",
          gap: 12, marginBottom: 16,
        }}>
          {mode === "image" && (
            <>
              {/* Input image */}
              <div>
                <SectionLabel>Input Image</SectionLabel>
                <div
                  className={isDragging ? "drop-zone-active" : ""}
                  onClick={() => !inputImg && fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
                  style={{
                    borderRadius: 14, overflow: "hidden", cursor: inputImg ? "default" : "pointer",
                    border: "1.5px dashed var(--border)", background: "var(--card)",
                    aspectRatio: "4/3", position: "relative", transition: "all 0.15s",
                  }}>
                  {inputImg ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={inputImg} alt="input" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      <button onClick={(e) => { e.stopPropagation(); clearImage(); }}
                        style={{
                          position: "absolute", top: 10, right: 10, width: 26, height: 26,
                          borderRadius: "50%", background: "var(--ink)", color: "white",
                          border: "none", cursor: "pointer", fontSize: 14, display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}>×</button>
                    </>
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <UploadIcon />
                      <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "'DM Sans'" }}>Drop or click to upload</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 28 }}>
                <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
                  <line x1="0" y1="7" x2="22" y2="7"
                    stroke={isRunning || hasResult ? "var(--accent)" : "var(--ink-faint)"}
                    strokeWidth="1" strokeDasharray="3 2" />
                  <path d="M20 3L26 7L20 11"
                    stroke={isRunning || hasResult ? "var(--accent)" : "var(--ink-faint)"}
                    strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </>
          )}

          {/* Output image */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <SectionLabel>Output Image</SectionLabel>
              {hasResult && (
                <button onClick={downloading} style={{ fontSize: 11, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, opacity: 0.85 }}>
                  <DownloadIcon /> Download
                </button>
              )}
            </div>
            <div style={{
              borderRadius: 14, overflow: "hidden", position: "relative",
              border: "1.5px solid var(--border)", background: "var(--card)",
              aspectRatio: mode === "image" ? "4/3" : "21/8",
              minHeight: 220,
            }}>
              {isRunning && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div className="spinner spinner-dark" />
                  <span style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "'DM Sans'" }}>{STEP_LABEL[run.step]}</span>
                </div>
              )}
              {hasResult && run.outputSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={run.outputSrc} alt="output" className="fade-up"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              )}
              {run.step === "error" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 24 }}>
                  <span style={{ fontSize: 12, color: "#B94040", fontWeight: 500 }}>Generation failed</span>
                  <span style={{ fontSize: 11, color: "var(--ink-muted)", textAlign: "center", maxWidth: 340 }}>{run.error}</span>
                </div>
              )}
              {run.step === "idle" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "'JetBrains Mono'" }}>output will appear here</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Intent badge ── */}
        {(run.intentKey || resolvedSelected) && (
          <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>intent</span>
            <span style={{
              padding: "3px 10px", borderRadius: 99, fontSize: 11,
              background: "var(--accent-pale)", color: "var(--accent)",
              border: "1px solid var(--accent-border)", fontFamily: "'JetBrains Mono'",
            }}>
              {run.intentKey || resolvedSelected}
            </span>
            {run.baseIntent && (
              <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                — {INTENT_DESCRIPTIONS[run.baseIntent]}
              </span>
            )}
          </div>
        )}

        {/* ── Row 2: Three prompt panels ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <PromptPanel
            label="User Prompt"
            sub="your raw input"
            value={userPrompt}
            onChange={setUserPrompt}
            placeholder={`e.g. "flat lay of a cream linen shirt on marble"\n\nor "make the flowers bigger" (with image)`}
            editable
          />
          <PromptPanel
            label="Enhancement Instructions"
            sub={selectedBase ? `${selectedBase} · editable` : "auto-loaded from intent · editable"}
            value={enhancement}
            onChange={setEnhancement}
            placeholder="Enhancement instructions load automatically when an intent is classified, or when you select one from the dropdown below."
            editable
            accent
          />
          <PromptPanel
            label="Enhanced Prompt"
            sub="sent to image generator · read-only"
            value={run.enhancedPrompt}
            onChange={() => {}}
            placeholder="Enhanced prompt appears here after generation…"
            editable={false}
            loading={run.step === "enhancing" || run.step === "generating"}
          />
        </div>

        {/* ── Row 3: Intent override + Run ── */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          {/* Dropdown */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--ink-muted)", marginBottom: 6, fontFamily: "'DM Sans'" }}>
              Override intent <span style={{ color: "var(--ink-faint)" }}>(optional — auto-detected from prompt when empty)</span>
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedBase}
                onChange={(e) => handleIntentOverride(e.target.value)}
                style={{
                  width: "100%", padding: "9px 32px 9px 12px",
                  borderRadius: 10, fontSize: 12, fontFamily: "'DM Sans'",
                  border: "1px solid var(--border)", background: "var(--card)",
                  color: "var(--ink-soft)", cursor: "pointer", appearance: "none",
                }}
              >
                <option value="">Auto-detect intent</option>
                <optgroup label="── Intents ──">
                  {grouped.main.map((i) => (
                    <option key={i.key} value={i.key}>{i.label}{i.hasI2i ? " (+i2i)" : ""}</option>
                  ))}
                </optgroup>
                <optgroup label="── Fallback ──">
                  {grouped.fallback.map((i) => (
                    <option key={i.key} value={i.key}>{i.label}</option>
                  ))}
                </optgroup>
              </select>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Run button + step dots */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {isRunning && (
              <div style={{ display: "flex", gap: 5 }}>
                {(["classifying", "enhancing", "generating"] as Step[]).map((s, i) => {
                  const order: Step[] = ["classifying", "enhancing", "generating"];
                  const ci = order.indexOf(run.step);
                  return (
                    <div key={s} style={{
                      width: 6, height: 6, borderRadius: "50%", transition: "all 0.25s",
                      background: i < ci ? "var(--accent)" : i === ci ? "var(--ink)" : "var(--border)",
                      transform: i === ci ? "scale(1.5)" : "scale(1)",
                    }} />
                  );
                })}
              </div>
            )}
            <button
              onClick={handleRun}
              disabled={!userPrompt.trim() || isRunning}
              style={{
                padding: "10px 28px", borderRadius: 10, fontSize: 13,
                fontFamily: "'DM Sans'", fontWeight: 500,
                background: isRunning ? "var(--ink-soft)" : "var(--ink)",
                color: "white", border: "none", cursor: isRunning ? "not-allowed" : "pointer",
                opacity: !userPrompt.trim() ? 0.4 : 1,
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.15s", minWidth: 150, justifyContent: "center",
              }}
            >
              {isRunning ? (
                <><span className="spinner" /> {STEP_LABEL[run.step]}</>
              ) : (
                <>Generate →</>
              )}
            </button>
          </div>
        </div>

        {/* ── Run log ── */}
        {hasResult && (
          <div className="fade-up" style={{
            marginTop: 20, borderRadius: 10, padding: "14px 18px",
            border: "1px solid var(--border)", background: "var(--card)",
            display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 20,
          }}>
            <LogRow label="intent" value={run.intentKey} mono />
            <LogRow label="mode" value={hasImage ? "i2i" : "t2i"} mono />
            <LogRow label="description" value={INTENT_DESCRIPTIONS[run.baseIntent] ?? "—"} />
          </div>
        )}
      </main>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontFamily: "'DM Sans'", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.1em",
      color: "var(--ink-muted)", marginBottom: 8,
    }}>
      {children}
    </p>
  );
}

function PromptPanel({
  label, sub, value, onChange, placeholder, editable, accent, loading,
}: {
  label: string; sub: string; value: string; onChange: (v: string) => void;
  placeholder: string; editable: boolean; accent?: boolean; loading?: boolean;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${accent ? "var(--accent-border)" : "var(--border)"}`,
      background: "var(--card)",
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px", borderBottom: "1px solid var(--border-soft)",
        background: accent ? "var(--accent-pale)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)", fontFamily: "'DM Sans'" }}>{label}</p>
          <p style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 1, fontFamily: "'DM Sans'" }}>{sub}</p>
        </div>
        {!editable && value && (
          <button
            onClick={() => navigator.clipboard.writeText(value)}
            style={{
              fontSize: 10, padding: "3px 8px", borderRadius: 6, cursor: "pointer",
              color: "var(--ink-muted)", border: "1px solid var(--border)",
              background: "transparent", fontFamily: "'DM Sans'",
            }}>copy</button>
        )}
      </div>

      {/* Body */}
      <div style={{ position: "relative", flex: 1 }}>
        {loading && <div className="shimmer" style={{ position: "absolute", inset: 0 }} />}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={!editable}
          rows={10}
          style={{
            padding: "12px 14px", opacity: loading ? 0 : 1,
            cursor: editable ? "text" : "default",
          }}
        />
      </div>
    </div>
  );
}

function LogRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{label}</span>
      <span style={{ fontSize: 11, color: "var(--ink-soft)", fontFamily: mono ? "'JetBrains Mono'" : "'DM Sans'" }}>{value || "—"}</span>
    </>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
