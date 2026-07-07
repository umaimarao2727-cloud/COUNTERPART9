"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function IncomingRequests({ requests }) {
  const supabase = createClient();
  const [items, setItems] = useState(requests);

  async function respond(id, status) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("intro_requests").update({ status }).eq("id", id);
  }

  if (!items || items.length === 0) return null;

  const pending = items.filter((r) => r.status === "pending");
  const accepted = items.filter((r) => r.status === "accepted");

  return (
    <div style={{ marginBottom: 32 }}>
      {pending.length > 0 && (
        <div style={{ marginBottom: accepted.length ? 20 : 0 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Requests waiting on you</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.map((r) => (
              <div key={r.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <strong style={{ fontFamily: "'Fraunces', serif", fontSize: 17 }}>{r.sender?.name || "Someone"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}> wants to connect · {r.sender?.niche}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => respond(r.id, "accepted")} className="btn btn-primary" style={{ background: "var(--teal)", padding: "8px 16px", fontSize: 13 }}>Accept</button>
                  <button onClick={() => respond(r.id, "declined")} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {accepted.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Connected</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {accepted.map((r) => (
              <div key={r.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <strong style={{ fontFamily: "'Fraunces', serif", fontSize: 17 }}>{r.sender?.name}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}> · {r.sender?.niche}</span>
                </div>
                <div className="mono" style={{ fontSize: 13, color: "var(--teal)" }}>{r.sender?.email}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
