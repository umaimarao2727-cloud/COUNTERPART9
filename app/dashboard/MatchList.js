"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MatchList({ matches, savedIds, viewerRole }) {
  const supabase = createClient();
  const [saved, setSaved] = useState(new Set(savedIds));
  const accent = viewerRole === "business" ? "var(--teal)" : "var(--brass)";
  const dim = viewerRole === "business" ? "var(--teal-dim)" : "var(--brass-dim)";

  async function toggleSave(matchedId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isSaved = saved.has(matchedId);
    const next = new Set(saved);
    isSaved ? next.delete(matchedId) : next.add(matchedId);
    setSaved(next); // optimistic update

    if (isSaved) {
      await supabase.from("saved_matches").delete().eq("user_id", user.id).eq("matched_id", matchedId);
    } else {
      await supabase.from("saved_matches").insert({ user_id: user.id, matched_id: matchedId });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
      {matches.map((m) => {
        const isSaved = saved.has(m.id);
        return (
          <div key={m.id} style={{ background: "var(--paper)", padding: 24, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 19 }}>{m.name}</span>
                <span className="mono" style={{ fontSize: 11, padding: "3px 8px", background: dim, color: accent }}>{m.niche}</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 460 }}>{m.bio || "No bio provided yet."}</p>
              <div className="mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                {viewerRole === "business" ? "Rate" : "Budget"}: ${Number(m.budget || 0).toLocaleString()}/mo
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, minWidth: 120 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24 }}>{m.score}%</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>match score</div>
              </div>
              <button
                onClick={() => toggleSave(m.id)}
                className="btn btn-ghost"
                style={{ borderColor: isSaved ? accent : "var(--line)", color: isSaved ? accent : "var(--ink)" }}
              >
                {isSaved ? "Saved ✓" : "Save"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
