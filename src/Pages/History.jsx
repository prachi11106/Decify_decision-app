import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDecision } from "../Context/DecisionContext";
import { useDebounce } from "../Hooks/UseDebounce";
import { calculateScores, getBestOption } from "../Utils/Decision";

export default function History() {
  const navigate = useNavigate();
  const { decisions, deleteDecision } = useDecision();

  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("newest");
  const dSearch = useDebounce(search, 280);

  const list = useMemo(() => {
    let data = [...decisions];
    if (dSearch.trim()) {
      const q = dSearch.toLowerCase();
      data = data.filter(d =>
        [d.title, ...(d.options||[]), ...(d.criteria||[]).map(c=>c.name)]
          .join(" ").toLowerCase().includes(q)
      );
    }
    if (sort === "oldest")      data.sort((a,b) => (a.createdAt||"").localeCompare(b.createdAt||""));
    if (sort === "newest")      data.sort((a,b) => (b.createdAt||"").localeCompare(a.createdAt||""));
    if (sort === "most-options") data.sort((a,b) => (b.options?.length||0)-(a.options?.length||0));
    return data;
  }, [decisions, dSearch, sort]);

  const getWinner = d => {
    try { return getBestOption(calculateScores(d)).best; }
    catch { return null; }
  };

  const fmt = iso => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }); }
    catch { return ""; }
  };

  const clearAll = () => {
    if (window.confirm("This will remove all your saved decisions. Are you sure?")) {
      decisions.forEach(d => deleteDecision(d.id));
    }
  };

  if (!decisions.length) return (
    <div className="wrap">
      <div className="card anim-up">
        <div className="empty">
          <span className="empty-ico">👀</span>
          <h3>Nothing here yet</h3>
          <p style={{ marginBottom:20 }}>Your past decisions will show up here once you make one.</p>
          <button className="btn btn-rose" onClick={() => navigate("/create")}>
            Make my first decision
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wrap">
      {/* Header */}
      <div className="page-header anim-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
        <div>
          <h1>Your decisions</h1>
          <p style={{ marginTop:6, color:"var(--ink-3)", fontSize:15 }}>
            {decisions.length === 1 ? "1 decision saved." : `${decisions.length} decisions saved — each one a step forward.`}
          </p>
        </div>
        <div className="btn-row">
          <button className="btn btn-danger" onClick={clearAll}>Clear all</button>
          <button className="btn btn-rose" onClick={() => navigate("/create")}>+ New decision</button>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap anim-up d1">
        <span className="search-ico">🔍</span>
        <input
          className="field"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, option, or criteria…"
        />
      </div>

      {/* Filters */}
      <div className="filter-row anim-up d2">
        <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="most-options">Most options</option>
        </select>
        <span style={{ fontSize:13, color:"var(--ink-4)", marginLeft:"auto" }}>
          {list.length === decisions.length ? `${list.length} total` : `${list.length} of ${decisions.length}`}
        </span>
      </div>

      {/* No results */}
      {list.length === 0 && (
        <div className="empty anim-in">
          <span className="empty-ico">🔎</span>
          <p>No decisions match "{dSearch}"</p>
        </div>
      )}

      {/* Cards */}
      {list.map((d, i) => {
        const winner = getWinner(d);
        return (
          <div key={d.id||i} className={`hist-card anim-up d${Math.min(i+1,6)}`}>
            <div className="hist-top">
              <div style={{ flex:1, minWidth:0 }}>
                <div className="hist-title">{d.title || "Untitled decision"}</div>
                {winner && (
                  <div className="hist-winner">✓ Best: {winner}</div>
                )}
                <div className="hist-meta">
                  <span>📋 {d.options?.length||0} options</span>
                  <span>⚖️ {d.criteria?.length||0} criteria</span>
                  {d.createdAt && <span>📅 {fmt(d.createdAt)}</span>}
                </div>
              </div>
              <div className="btn-row" style={{ flexShrink:0, gap:8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => navigate("/result", { state: d })}>
                  View
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteDecision(d.id)}>
                  Remove
                </button>
              </div>
            </div>

            <div className="tag-row" style={{ marginTop:12 }}>
              {(d.options||[]).map((opt, j) => (
                <span key={j} className={`tag ${opt===winner?"tag--ok":""}`}>{opt}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}