// Scores how well two profiles fit, from 8 (weak) to 100 (strong).
// Looks at how much their niche/industry words overlap, and whether
// the business's budget covers the manager's rate.
export function scoreMatch(viewer, candidate) {
  const viewerNiche = (viewer.niche || "").toLowerCase();
  const candidateNiche = (candidate.niche || "").toLowerCase();

  const viewerWords = viewerNiche.split(/[\s,]+/).filter(Boolean);
  const candidateWords = candidateNiche.split(/[\s,]+/).filter(Boolean);
  const overlap = viewerWords.filter((w) => candidateWords.includes(w));

  let score = Math.min(overlap.length * 22, 55);

  const bizBudget = Number(viewer.role === "business" ? viewer.budget : candidate.budget) || 0;
  const mgrRate = Number(viewer.role === "manager" ? viewer.budget : candidate.budget) || 0;

  if (bizBudget && mgrRate) {
    if (bizBudget >= mgrRate) score += 35;
    else score += Math.max(0, 35 - (mgrRate - bizBudget) / 20);
  } else {
    score += 10;
  }

  score += 10; // base credit for having an active profile
  return Math.max(8, Math.min(100, Math.round(score)));
}
