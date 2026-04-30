import { useState, useEffect } from "react";

const FALLBACKS = [
  { text: "The quality of your life is a direct reflection of the quality of your decisions.", author: "Tony Robbins" },
  { text: "A good decision is based on knowledge, not on numbers.", author: "Plato" },
  { text: "You are the sum total of every choice you have ever made.", author: "Anonymous" },
  { text: "Indecision is the biggest thief of opportunity.", author: "Jim Rohn" },
];

export function useQuote() {
  const [quote,   setQuote]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api.quotable.io/random?tags=inspirational,wisdom", { signal: ctrl.signal });
        if (!res.ok) throw new Error();
        const d = await res.json();
        setQuote({ text: d.content, author: d.author });
      } catch (e) {
        if (e.name !== "AbortError") {
          setQuote(FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]);
        }
      } finally { setLoading(false); }
    })();
    return () => ctrl.abort();
  }, []);

  return { quote, loading };
}