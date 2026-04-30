import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { calculateScores, getBestOption, getConfidence, explainWinner } from "../Utils/Decision";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Result() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  /* Animate bars in after mount */
  const [barsReady, setBarsReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!state) return (
    <div className="wrap" style={{ textAlign: "center", paddingTop: 80 }}>
      <span style={{ fontSize: "3rem", display: "block", marginBottom: 16 }}>🤔</span>
      <h2 style={{ marginBottom: 10, fontFamily: "var(--f-head)" }}>Nothing to show yet</h2>
      <p style={{ marginBottom: 24 }}>Start a new decision and come back here.</p>
      <button className="btn btn-rose" onClick={() => navigate("/create")}>Let's figure something out</button>
    </div>
  );

  const { ranked, best, confidence, chartData, maxScore, reason } = useMemo(() => {
    const scores     = calculateScores(state);
    const best       = getBestOption(scores);
    const confidence = getConfidence(scores);
    const ranked     = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([name, score], i) => ({ rank: i + 1, name, score }));
    const chartData  = ranked.map(({ name, score }) => ({ name, score }));
    const maxScore   = Math.max(...ranked.map(r => r.score));
    const reason     = explainWinner(state, best.best);
    return { ranked, best, confidence, chartData, maxScore, reason };
  }, [state]);

  const export_txt = () => {
    const lines = [
      `DECIFY — Decision Result`,
      `Decision: ${state.title || "Untitled"}`,
      `Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      "",
      `WINNER: ${best.best}  (score: ${best.max}pts, confidence: ${confidence}%)`,
      "",
      "ALL OPTIONS RANKED:",
      ...ranked.map(r => `  #${r.rank}  ${r.name}: ${r.score} pts`),
      "",
      "CRITERIA USED:",
      ...(state.criteria || []).map(c => `  ${c.name}  (weight ${c.weight})`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `${(state.title || "decision").replace(/\s+/g, "_")}_result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wrap">

      {/* Breadcrumb */}
      <div className="anim-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13, color: "var(--ink-4)" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}>Home</button>
        <span>/</span>
        <span style={{ color: "var(--ink-3)" }}>Result</span>
      </div>

      {/* Intro line */}
      <div className="anim-up" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: "var(--ink-3)", fontStyle: "italic", fontFamily: "var(--f-head)" }}>
          Based on what you entered for "{state.title || "your decision"}"…
        </p>
      </div>

      {/* ── Winner card ── */}
      <div className="winner-card anim-up d1">
        <div className="winner-label">✦ This option stands out</div>
        <div className="winner-name">{best.best}</div>
        <div className="winner-score">Weighted score: {best.max} pts</div>

        {/* Confidence bar */}
        <div className="confidence-wrap">
          <div className="confidence-label">
            <span>How clear is this result?</span>
            <span style={{ fontWeight: 600, color: "var(--rose)" }}>{confidence}% confident</span>
          </div>
          <div className="confidence-track">
            <div className="confidence-fill" style={{ width: barsReady ? `${confidence}%` : "0%" }} />
          </div>
        </div>

        {reason && (
          <div className="reason-box" dangerouslySetInnerHTML={{ __html: `<strong>Here's why:</strong> ${reason}` }} />
        )}
      </div>

      {/* ── Rankings — with winner accent bar ── */}
      <div className="card anim-up d2">
        <div className="card-eyebrow">
          <span>How they all compared</span>
          <span className="pill pill--rose">{ranked.length} options</span>
        </div>

        {/* Visual bar comparison — more scannable than a table alone */}
        <div className="result-bars" style={{ marginBottom: 20 }}>
          {ranked.map((row, i) => (
            <div
              key={row.name}
              className="result-bar-row"
              style={{
                borderLeft: row.rank === 1 ? "3px solid var(--rose)" : "3px solid transparent",
                paddingLeft: 12,
                marginBottom: 14,
                transition: "border-color 0.3s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: row.rank === 1 ? 600 : 400,
                  color: row.rank === 1 ? "var(--ink)" : "var(--ink-2)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {MEDALS[i] || `#${row.rank}`} {row.name}
                  {row.rank === 1 && <span className="pill pill--ok" style={{ fontSize: 10 }}>top pick</span>}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.rank === 1 ? "var(--rose)" : "var(--ink-3)" }}>
                  {row.score}
                </span>
              </div>
              <div style={{ height: 6, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  borderRadius: 3,
                  background: row.rank === 1 ? "var(--rose)" : "var(--blush)",
                  width: barsReady ? `${(row.score / maxScore) * 100}%` : "0%",
                  transition: `width 0.8s cubic-bezier(.22,1,.36,1) ${i * 0.15}s`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="card anim-up d3">
        <div className="card-eyebrow"><span>Score at a glance</span></div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--ink-3)", fontFamily: "var(--f-body)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--ink-3)", fontFamily: "var(--f-body)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13, fontFamily: "var(--f-body)" }}
              cursor={{ fill: "var(--rose-lt)" }}
            />
            <Bar dataKey="score" name="Score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.score === maxScore ? "var(--rose)" : "var(--parchment)"} opacity={entry.score === maxScore ? 1 : 0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Criteria used ── */}
      <div className="card anim-up d4">
        <div className="card-eyebrow"><span>What you weighed it against</span></div>
        <div className="tag-row" style={{ marginTop: 0 }}>
          {(state.criteria || []).map((c, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--surface-tint)", border: "1px solid var(--line)",
              borderRadius: "var(--r-pill)", padding: "6px 14px",
              fontSize: 13, color: "var(--ink-2)",
            }}>
              {c.name}
              <span style={{
                background: "var(--rose)", color: "#fff",
                borderRadius: "var(--r-pill)", padding: "1px 8px",
                fontSize: 11, fontWeight: 700,
              }}>
                ×{c.weight}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="btn-row anim-up d5" style={{ justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={() => navigate("/history")}>See all past decisions</button>
        <button className="btn btn-ghost" onClick={export_txt}>Download result</button>
        <button className="btn btn-rose" onClick={() => navigate("/create")}>Make another decision</button>
      </div>

    </div>
  );
}