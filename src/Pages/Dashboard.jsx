import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useDecision } from "../context/DecisionContext";
import { useQuote } from "../hooks/useQuote";
import ModernChart from "../components/ModernChart";

/* ── Rotating decision prompts ── */
const PROMPTS = [
  "Should I quit my job?",
  "Which city should I move to?",
  "Do I need a co-founder?",
  "Should I go back to school?",
  "Which offer should I take?",
  "Is it the right time to freelance?",
  "Should I say yes to this?",
];

const PREVIEW_OPTIONS = [
  { name: "Accept the offer",      score: 78, winner: true  },
  { name: "Ask for counter-offer", score: 55, winner: false },
  { name: "Stay in current role",  score: 42, winner: false },
];

const STAGES = [
  "Naming the decision…",
  "Adding options…",
  "Setting criteria…",
  "Revealing the answer…",
];

/* ─────────────────────────────────────────
   Animated preview — sequential timeline
───────────────────────────────────────── */
function AnimatedPreview() {
  const [stage,    setStage]    = useState(0);
  const [bars,     setBars]     = useState([0, 0, 0]);
  const [showWin,  setShowWin]  = useState(false);
  const [showCav,  setShowCav]  = useState(false);
  const [showCrit, setShowCrit] = useState(false);

  useEffect(() => {
    let dead = false;
    const wait = ms => new Promise(r => setTimeout(r, ms));

    async function run() {
      while (!dead) {
        setStage(0); setBars([0, 0, 0]);
        setShowWin(false); setShowCav(false); setShowCrit(false);
        await wait(1000); if (dead) break;
        setStage(1);
        await wait(1100); if (dead) break;
        setStage(2);
        await wait(900);  if (dead) break;
        setShowCrit(true);
        await wait(800);  if (dead) break;
        setStage(3);
        await wait(400);  if (dead) break;
        setBars([78, 0, 0]);
        await wait(420);  if (dead) break;
        setBars([78, 55, 0]);
        await wait(420);  if (dead) break;
        setBars([78, 55, 42]);
        await wait(500);  if (dead) break;
        setShowWin(true);
        await wait(500);  if (dead) break;
        setShowCav(true);
        await wait(3500);
      }
    }

    run();
    return () => { dead = true; };
  }, []);

  const showBars = stage === 3;
  const showOpts = stage >= 1;

  return (
    <div className="hero-preview">
      {/* Stage dots + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {STAGES.map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: i <= stage ? "var(--rose)" : "var(--line)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "var(--ink-4)",
          textTransform: "uppercase", letterSpacing: ".07em",
        }}>
          {STAGES[stage]}
        </span>
      </div>

      {/* Decision title */}
      <div style={{
        fontFamily: "var(--f-head)", fontSize: 14, fontWeight: 600,
        color: "var(--ink)", marginBottom: 14, lineHeight: 1.4,
      }}>
        Should I take the new job offer?
      </div>

      {/* Options */}
      <div style={{ opacity: showOpts ? 1 : 0.1, transition: "opacity 0.6s" }}>
        {PREVIEW_OPTIONS.map((opt, i) => (
          <div key={i} style={{
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--line)",
            borderLeft: showWin && opt.winner ? "4px solid var(--rose)" : "4px solid transparent",
            background: showWin && opt.winner ? "var(--rose-lt)" : "var(--surface-tint)",
            padding: "10px 12px",
            marginBottom: 8,
            transition: "all 0.5s cubic-bezier(.22,1,.36,1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{
                fontSize: 13,
                fontWeight: showWin && opt.winner ? 700 : 400,
                color: showWin && opt.winner ? "var(--ink)" : "var(--ink-2)",
                fontFamily: showWin && opt.winner ? "var(--f-head)" : "var(--f-body)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {showWin && opt.winner && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--rose)", textTransform: "uppercase", letterSpacing: ".06em", fontFamily: "var(--f-body)" }}>
                    ✦ top pick
                  </span>
                )}
                {opt.name}
              </span>
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: opt.winner ? "var(--rose)" : "var(--ink-4)",
                opacity: bars[i] > 0 ? 1 : 0,
                transition: "opacity 0.3s",
                minWidth: 24, textAlign: "right",
              }}>
                {opt.score}
              </span>
            </div>
            <div style={{ height: 5, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                background: opt.winner ? "var(--rose)" : "var(--blush)",
                width: showBars ? `${bars[i]}%` : "0%",
                transition: `width 0.75s cubic-bezier(.22,1,.36,1) ${i * 0.18}s`,
                opacity: opt.winner ? 1 : 0.6,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Caveat */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 7,
        opacity: showCav ? 1 : 0,
        transform: showCav ? "translateY(0)" : "translateY(6px)",
        transition: "all 0.5s ease",
        marginTop: 2, marginBottom: 10,
        fontSize: 12, fontFamily: "var(--f-head)", fontStyle: "italic",
        color: "var(--ink-3)", lineHeight: 1.5,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--warn)", flexShrink: 0, marginTop: 4 }} />
        You weighted stability low — worth a second look?
      </div>

      {/* Criteria chips */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6,
        opacity: showCrit ? 1 : 0,
        transition: "opacity 0.5s",
        borderTop: "1px solid var(--line)",
        paddingTop: 10,
      }}>
        {["Salary ×8", "Growth ×7", "Commute ×4"].map((c, i) => (
          <span key={i} style={{
            fontSize: 11, padding: "4px 10px",
            borderRadius: "var(--r-pill)",
            background: "var(--rose-lt)",
            color: "var(--rose)",
            fontWeight: 600,
            border: "1px solid var(--blush-lt)",
          }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Rotating prompt
───────────────────────────────────────── */
function RotatingPrompt() {
  const [idx,     setIdx]     = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % PROMPTS.length);
        setVisible(true);
      }, 320);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="prompt-teaser">
      <span className="prompt-teaser-label">People decide things like:</span>
      <span
        className="prompt-teaser-text"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(5px)",
        }}
      >
        {PROMPTS[idx]}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { decisions, stats } = useDecision();
  const { quote, loading: qLoading } = useQuote();

  const hasData = decisions.length > 0;

  return (
    <div className="wrap--wide">

      {/* ── Hero ── */}
      <div className="hero-grid anim-up">

        {/* Left */}
        <div className="hero-copy">
          <p className="hero-eyebrow">For decisions that keep you up at night</p>

          <h1 style={{ marginBottom: 16, lineHeight: 1.15 }}>
            Make the call<br />
            <span style={{ fontStyle: "italic", color: "var(--rose)" }}>with confidence.</span>
          </h1>

          <p style={{ fontSize: 16, maxWidth: 400, lineHeight: 1.75, marginBottom: 10, color: "var(--ink-2)" }}>
            Hard decisions aren't hard because you don't know.
            They're hard because{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>everything feels important.</strong>
            {" "}Decify helps you sort that out.
          </p>

          <RotatingPrompt />

          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn btn-rose btn-lg" onClick={() => navigate("/create")}>
              Start a new decision
            </button>
            {hasData && (
              <button className="btn btn-ghost" onClick={() => navigate("/history")}>
                Look back
              </button>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="anim-up d2">
          <AnimatedPreview />
        </div>
      </div>

      {/* ── Quote ── */}
      <div className="anim-up d1">
        {qLoading ? (
          <div className="skel" style={{ height: 80, marginBottom: 24 }} />
        ) : quote && (
          <div className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-by">— {quote.author}</p>
          </div>
        )}
      </div>

      {/* ── Stats or empty state ── */}
      {hasData ? (
        <div className="stats-grid anim-up d2">
          {[
            { ico: "📊", val: stats.total,                        desc: "decisions made"    },
            { ico: "🏆", val: stats.mostChosen || "—",            desc: "most chosen option" },
            { ico: "🧠", val: decisions[0].criteria?.length || 0, desc: "criteria (latest)" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <span className="stat-ico">{s.ico}</span>
              <div className="stat-val" style={{ fontSize: String(s.val).length > 7 ? "1.1rem" : undefined }}>
                {s.val}
              </div>
              <div className="stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card anim-up d2" style={{ marginBottom: 18 }}>
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: "1.8rem", color: "var(--rose)", marginBottom: 16, fontFamily: "var(--f-head)", opacity: 0.5 }}>✦</div>
            <h3 style={{ fontFamily: "var(--f-head)", fontSize: "1.2rem", marginBottom: 8, color: "var(--ink)" }}>
              Your first decision is always the hardest.
            </h3>
            <p style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 22, maxWidth: 340, margin: "0 auto 22px" }}>
              Start one and Decify will help you see it clearly — usually in under 3 minutes.
            </p>
            <button className="btn btn-rose" onClick={() => navigate("/create")}>
              Let's figure something out →
            </button>
          </div>
        </div>
      )}

      {/* ── Modern Activity Chart ── */}
      {hasData && stats.recentActivity.length > 0 && (
        <div className="anim-up d3">
          <ModernChart data={stats.recentActivity} total={stats.total} />
        </div>
      )}

      {/* ── How it works ── */}
      <div className="card anim-up d4">
        <div className="card-eyebrow"><span>How it works</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {[
            ["1", "What's on your mind?",           "Give it a title. The more honest, the better."],
            ["2", "What are you choosing between?",  "Add every option you're genuinely considering."],
            ["3", "What actually matters to you?",   "Not what should matter — what does. Price, peace, growth."],
            ["4", "Rate them. See the answer.",      "Decify weighs it all and tells you what your own numbers say."],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ display: "flex", gap: 14, padding: 14, background: "var(--surface-tint)", borderRadius: "var(--r-md)" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--rose-lt)", color: "var(--rose)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "var(--f-head)",
              }}>
                {n}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, fontFamily: "var(--f-head)" }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}