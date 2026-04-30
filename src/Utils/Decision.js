export function calculateScores(data) {
  const { options = [], criteria = [], ratings = {} } = data;
  const scores = {};
  options.forEach(opt => {
    let total = 0;
    criteria.forEach(c => {
      const w = Number(c.weight) || 1;
      const r = Number(ratings[opt]?.[c.name]) ?? 5;
      total += w * r;
    });
    scores[opt] = total;
  });
  return scores;
}

export function getBestOption(scores) {
  let best = "", max = -Infinity;
  for (const k in scores) {
    if (scores[k] > max) { max = scores[k]; best = k; }
  }
  return { best, max };
}

/* Confidence: how far ahead is the winner vs the field? 0–100 */
export function getConfidence(scores) {
  const vals = Object.values(scores);
  if (vals.length < 2) return 100;
  const sorted = [...vals].sort((a, b) => b - a);
  const gap = sorted[0] - sorted[1];
  const range = sorted[0] - Math.min(...vals);
  if (range === 0) return 50;
  return Math.round(Math.min((gap / range) * 100, 100));
}

/* Why did this option win? Generates a human sentence. */
export function explainWinner(data, winner) {
  const { criteria = [], ratings = {} } = data;
  if (!criteria.length) return null;
  const sorted = [...criteria].sort((a, b) => {
    const ra = Number(ratings[winner]?.[a.name]) ?? 5;
    const rb = Number(ratings[winner]?.[b.name]) ?? 5;
    return (rb * b.weight) - (ra * a.weight);
  });
  const top = sorted[0];
  const score = Number(ratings[winner]?.[top.name]) ?? 5;
  const label = score >= 8 ? "scored particularly well" : score >= 6 ? "held up well" : "fared reasonably";
  return `"${winner}" ${label} on <strong>${top.name}</strong> (weight ${top.weight}), which had the biggest pull on the final result.`;
}