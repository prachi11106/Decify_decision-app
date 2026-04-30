import { createContext, useContext, useState, useCallback } from "react";
import { calculateScores, getBestOption } from "../Utils/Decision";

const Ctx = createContext(null);

export function DecisionProvider({ children }) {
  const [decisions, setDecisions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("decify_v2")) || []; }
    catch { return []; }
  });

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("decify_theme") === "dark";
    if (saved) document.documentElement.setAttribute("data-theme", "dark");
    return saved;
  });

  const [toast, setToast] = useState(null);

  /* theme */
  const toggleDark = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "");
      localStorage.setItem("decify_theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  /* toast */
  const showToast = useCallback((msg, icon = "✓") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2600);
  }, []);

  /* persist */
  const save = useCallback((list) => {
    setDecisions(list);
    localStorage.setItem("decify_v2", JSON.stringify(list));
  }, []);

  /* CRUD */
  const addDecision = useCallback((data) => {
    const entry = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
    save([entry, ...decisions]);
    showToast("Saved to history", "📋");
    return entry;
  }, [decisions, save, showToast]);

  const deleteDecision = useCallback((id) => {
    save(decisions.filter(d => d.id !== id));
    showToast("Removed", "🗑");
  }, [decisions, save, showToast]);

  const updateDecision = useCallback((id, patch) => {
    save(decisions.map(d => d.id === id ? { ...d, ...patch } : d));
    showToast("Updated", "✓");
  }, [decisions, save, showToast]);

  /* stats */
  const stats = (() => {
    if (!decisions.length) return { total: 0, mostChosen: null, recentActivity: [] };
    const tally = {};
    decisions.forEach(d => {
      try {
        const w = getBestOption(calculateScores(d)).best;
        tally[w] = (tally[w] || 0) + 1;
      } catch (_) {}
    });
    const mostChosen = Object.entries(tally).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
    const recentActivity = [...decisions].slice(0,6).reverse().map((d, i) => ({
      name: (d.title || `#${i+1}`).slice(0,14),
      options: d.options?.length || 0,
      criteria: d.criteria?.length || 0,
    }));
    return { total: decisions.length, mostChosen, recentActivity };
  })();

  return (
    <Ctx.Provider value={{ decisions, addDecision, deleteDecision, updateDecision, dark, toggleDark, stats, showToast }}>
      {children}
      {toast && (
        <div style={{
          position: "fixed", bottom: 22, right: 22,
          background: "var(--ink)", color: "var(--bg)",
          padding: "11px 20px", borderRadius: "var(--r-md)",
          fontSize: "13px", fontWeight: "600",
          fontFamily: "var(--f-body)",
          boxShadow: "var(--sh-lg)", zIndex: 9999,
          display: "flex", alignItems: "center", gap: "9px",
          animation: "fadeUp .28s var(--ease) both",
        }}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useDecision() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDecision must be inside DecisionProvider");
  return ctx;
}