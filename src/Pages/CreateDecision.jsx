import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDecision } from "../context/DecisionContext";

/* Smart criteria suggestions per decision type */
const CRITERIA_SUGGESTIONS = {
  default:  ["Cost", "Quality", "Ease", "Time", "Long-term value"],
  job:      ["Salary", "Growth potential", "Work-life balance", "Team culture", "Location"],
  laptop:   ["Price", "Performance", "Battery life", "Portability", "Build quality"],
  city:     ["Cost of living", "Job market", "Weather", "Social life", "Safety"],
  course:   ["Curriculum", "Instructor quality", "Price", "Schedule", "Reviews"],
};

function getSuggestions(title) {
  const t = title.toLowerCase();
  if (t.includes("job") || t.includes("offer") || t.includes("career")) return CRITERIA_SUGGESTIONS.job;
  if (t.includes("laptop") || t.includes("phone") || t.includes("device")) return CRITERIA_SUGGESTIONS.laptop;
  if (t.includes("city") || t.includes("move") || t.includes("relocat")) return CRITERIA_SUGGESTIONS.city;
  if (t.includes("course") || t.includes("college") || t.includes("degree")) return CRITERIA_SUGGESTIONS.course;
  return CRITERIA_SUGGESTIONS.default;
}

const STEP_META = [
  { id: "title",    label: "The question" },
  { id: "options",  label: "The choices"  },
  { id: "criteria", label: "What matters" },
  { id: "rate",     label: "Rate them"    },
];

const STEP_COPY = [
  {
    heading: "What are you trying to decide?",
    sub: "Give it a name you'll recognise later. The more specific, the better.",
    placeholder: "e.g. Should I take the job offer from Acme?",
  },
  {
    heading: "What are your options?",
    sub: "Add everything you're genuinely considering — even the ones you're not sure about.",
    placeholder: "e.g. Stay at current job",
  },
  {
    heading: "What matters to you here?",
    sub: "These are your criteria. Think about what would make one option clearly better than another.",
    placeholder: "e.g. Salary, Growth potential…",
  },
  {
    heading: "Now, rate each option.",
    sub: "Be honest — there are no wrong answers. Your gut will guide the numbers.",
  },
];

export default function CreateDecision() {
  const navigate = useNavigate();
  const { addDecision } = useDecision();

  const [step,       setStep]       = useState(0);
  const [title,      setTitle]      = useState("");
  const [optInput,   setOptInput]   = useState("");
  const [options,    setOptions]    = useState([]);
  const [critInput,  setCritInput]  = useState("");
  const [critWeight, setCritWeight] = useState(5);
  const [criteria,   setCriteria]   = useState([]);
  const [ratings,    setRatings]    = useState({});
  const [thinking,   setThinking]   = useState(false);

  /* ── helpers ── */
  const addOption = useCallback(() => {
    const v = optInput.trim();
    if (!v || options.includes(v)) return;
    setOptions(p => [...p, v]);
    setOptInput("");
  }, [optInput, options]);

  const removeOption = useCallback((o) => {
    setOptions(p => p.filter(x => x !== o));
    setRatings(p => { const n = {...p}; delete n[o]; return n; });
  }, []);

  const addCriteria = useCallback((name = critInput, weight = critWeight) => {
    const v = (name || "").trim();
    if (!v || criteria.find(c => c.name === v)) return;
    setCriteria(p => [...p, { name: v, weight }]);
    setCritInput("");
    setCritWeight(5);
  }, [critInput, critWeight, criteria]);

  const removeCriteria = useCallback((name) => {
    setCriteria(p => p.filter(c => c.name !== name));
  }, []);

  const setRating = useCallback((opt, crit, val) => {
    setRatings(p => ({ ...p, [opt]: { ...p[opt], [crit]: Number(val) } }));
  }, []);

  const onKey = (e, fn) => { if (e.key === "Enter") { e.preventDefault(); fn(); } };

  /* ── validation ── */
  const canNext = [
    title.trim().length > 0,
    options.length >= 2,
    criteria.length >= 1,
    true,
  ][step];

  /* ── submit with "thinking" moment ── */
  const handleSubmit = async () => {
    setThinking(true);
    await new Promise(r => setTimeout(r, 1800));
    setThinking(false);
    const data = { title: title.trim() || "Untitled", options, criteria, ratings };
    const entry = addDecision(data);
    navigate("/result", { state: { ...data, id: entry.id } });
  };

  const progress = ((step) / (STEP_META.length - 1)) * 100;
  const suggestions = getSuggestions(title);
  const unusedSuggestions = suggestions.filter(s => !criteria.find(c => c.name === s));

  /* ── inline helper text ── */
  const inlineHint = [
    title.trim().length > 3 ? "Looks good — that's a clear question." : "",
    options.length === 0 ? "Start by adding the first option you're considering." :
    options.length === 1 ? "Good start. Add at least one more." :
    `${options.length} options — that's a solid set.`,
    criteria.length === 0 ? "Think about what would make you choose one over another." :
    `${criteria.length} criteria set. Add more or move on.`,
    "Drag each slider to reflect how you honestly feel about that option.",
  ][step];

  return (
    <div className="wrap">

      {/* ── Thinking overlay ── */}
      {thinking && (
        <div className="thinking-overlay">
          <div className="thinking-dots">
            <span /><span /><span />
          </div>
          <p className="thinking-text">Working it out…</p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="page-header anim-up" style={{ marginBottom:32 }}>
        <h1>{STEP_COPY[step].heading}</h1>
        <p style={{ marginTop:8, fontSize:15, color:"var(--ink-3)" }}>
          {STEP_COPY[step].sub}
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="progress-track anim-up d1">
        <div className="progress-fill" style={{ width:`${progress}%` }} />
      </div>

      {/* ── Stepper ── */}
      <div className="stepper anim-up d1">
        {STEP_META.map((s, i) => (
          <div key={s.id} className={`step-item ${i === step ? "active" : i < step ? "done" : ""}`}>
            <div className="step-dot">
              {i < step ? "✓" : i + 1}
            </div>
            <div className="step-text">{s.label}</div>
          </div>
        ))}
      </div>
      

      {/* ════ STEP 0 — Title ════ */}
      {step === 0 && (
        <div className="card anim-scale">
          <label className="field-label">Your decision</label>
          <input
            className="field"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => onKey(e, () => canNext && setStep(1))}
            placeholder={STEP_COPY[0].placeholder}
            autoFocus
            style={{ fontSize:15 }}
          />
          {inlineHint && (
            <p className="field-hint" style={{ color: title.trim().length > 3 ? "var(--ok)" : "var(--ink-4)" }}>
              {inlineHint}
            </p>
          )}
        </div>
      )}

      {/* ════ STEP 1 — Options ════ */}
      {step === 1 && (
        <div className="card anim-scale">
          <div className="card-eyebrow">
            <span>Your options</span>
            {options.length > 0 && <span className="pill pill--rose">{options.length} added</span>}
          </div>

          <div className="field-row">
            <input
              className="field"
              value={optInput}
              onChange={e => setOptInput(e.target.value)}
              onKeyDown={e => onKey(e, addOption)}
              placeholder={STEP_COPY[1].placeholder}
              autoFocus
            />
            <button className="btn btn-rose" onClick={addOption}>Add</button>
          </div>

          {inlineHint && (
            <p className="field-hint" style={{ color: options.length >= 2 ? "var(--ok)" : "var(--ink-4)" }}>
              {inlineHint}
            </p>
          )}

          {options.length > 0 && (
            <div className="option-card-grid">
              {options.map((o, i) => (
                <div key={i} className="option-card">
                  <div className="option-card-name">{o}</div>
                  <button className="option-card-remove" onClick={() => removeOption(o)}>remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════ STEP 2 — Criteria ════ */}
      {step === 2 && (
        <div className="card anim-scale">
          <div className="card-eyebrow">
            <span>Your criteria</span>
            {criteria.length > 0 && <span className="pill pill--rose">{criteria.length} set</span>}
          </div>

          <div className="field-row" style={{ marginBottom:14 }}>
            <input
              className="field"
              value={critInput}
              onChange={e => setCritInput(e.target.value)}
              onKeyDown={e => onKey(e, () => addCriteria())}
              placeholder={STEP_COPY[2].placeholder}
              autoFocus
            />
            <button className="btn btn-rose" onClick={() => addCriteria()}>Add</button>
          </div>

          {/* Weight slider */}
          <div style={{ background:"var(--surface-tint)", borderRadius:"var(--r-md)", padding:16, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <label className="field-label" style={{ margin:0 }}>
                How important is this? &nbsp;
                <span style={{ color:"var(--ink-4)", fontWeight:400 }}>(1 = a little, 10 = a lot)</span>
              </label>
              <span style={{ background:"var(--rose)", color:"#fff", borderRadius:"var(--r-pill)", padding:"2px 10px", fontSize:13, fontWeight:700, minWidth:28, textAlign:"center" }}>
                {critWeight}
              </span>
            </div>
            <input type="range" min="1" max="10" value={critWeight} onChange={e => setCritWeight(Number(e.target.value))} />
          </div>

          {/* Smart suggestions */}
          {unusedSuggestions.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:12, color:"var(--ink-4)", marginBottom:8 }}>
                Quick add — things that often matter here:
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {unusedSuggestions.map(s => (
                  <button key={s} className="suggestion-chip" onClick={() => addCriteria(s, 5)}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {criteria.length > 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
              {criteria.map((c, i) => (
                <div key={i} className="crit-item">
                  <div>
                    <span className="crit-name">{c.name}</span>
                    <span className="crit-wt">importance: {c.weight}/10</span>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeCriteria(c.name)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {inlineHint && (
            <p className="field-hint" style={{ marginTop:12, color: criteria.length >= 1 ? "var(--ok)" : "var(--ink-4)" }}>
              {inlineHint}
            </p>
          )}
        </div>
      )}

      {/* ════ STEP 3 — Ratings ════ */}
      {step === 3 && (
        <div className="anim-scale">
          <p className="field-hint" style={{ marginBottom:20, color:"var(--ink-3)", fontSize:14 }}>
            {inlineHint}
          </p>
          {criteria.map((c, ci) => (
            <div key={ci} className="card" style={{ marginBottom:16 }}>
              <div className="card-eyebrow">
                <span>{c.name}</span>
                <span className="pill pill--warm">importance: {c.weight}/10</span>
              </div>
              {options.map((opt, oi) => (
                <div key={oi} className="rating-row">
                  <span className="rating-name" title={opt}>{opt}</span>
                  <input
                    type="range" min="1" max="10"
                    defaultValue={5}
                    onChange={e => setRating(opt, c.name, e.target.value)}
                  />
                  <span className="rating-num">{ratings[opt]?.[c.name] ?? 5}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Nav ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
        <button
          className="btn btn-ghost"
          onClick={() => step === 0 ? navigate("/") : setStep(s => s - 1)}
        >
          {step === 0 ? "← Cancel" : "← Back"}
        </button>

        {step < 3 ? (
          <button
            className="btn btn-rose"
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            style={{ opacity: canNext ? 1 : .4, cursor: canNext ? "pointer" : "not-allowed" }}
          >
            Continue →
          </button>
        ) : (
          <button className="btn btn-rose btn-lg" onClick={handleSubmit}>
            Show me the answer ✦
          </button>
        )}
      </div>

    </div>
  );
}