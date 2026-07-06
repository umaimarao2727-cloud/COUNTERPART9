"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", role: "business", niche: "", budget: "", bio: "" });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile) setForm(profile);
      setLoading(false);
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!form.name.trim()) { setErr("Enter your name."); return; }
    if (!form.niche.trim()) { setErr(form.role === "business" ? "Enter your industry." : "Enter your niche."); return; }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name: form.name,
      role: form.role,
      niche: form.niche,
      budget: Number(form.budget) || 0,
      bio: form.bio || "",
    });
    setSaving(false);

    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/dashboard");
  }

  if (loading) return <div className="wrap" style={{ padding: 80, color: "var(--muted)" }}>Loading…</div>;

  const accent = form.role === "business" ? "var(--teal)" : "var(--brass)";

  return (
    <div className="wrap" style={{ maxWidth: 520, padding: "64px 24px" }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Your profile</div>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Let's find your counterpart.</h1>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
        This is what the other side sees when you're matched. Be specific.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {["business", "manager"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm({ ...form, role: r })}
            style={{
              flex: 1, padding: 16, cursor: "pointer", fontWeight: 600, fontSize: 14,
              border: `1px solid ${form.role === r ? (r === "business" ? "var(--teal)" : "var(--brass)") : "var(--line)"}`,
              background: form.role === r ? (r === "business" ? "var(--teal-dim)" : "var(--brass-dim)") : "transparent",
            }}
          >
            {r === "business" ? "I run a business" : "I manage social media"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label className="field">
          Your name
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="field">
          {form.role === "business" ? "Industry" : "Niche you specialize in"}
          <input
            className="input"
            value={form.niche}
            onChange={(e) => setForm({ ...form, niche: e.target.value })}
            placeholder={form.role === "business" ? "e.g. skincare, fitness, e-commerce" : "e.g. fitness, e-commerce, coaching"}
          />
        </label>
        <label className="field">
          {form.role === "business" ? "Monthly budget (USD)" : "Monthly rate expectation (USD)"}
          <input className="input" type="number" min="0" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="1500" />
        </label>
        <label className="field">
          {form.role === "business" ? "What are you hoping to achieve?" : "A short pitch for clients"}
          <textarea className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </label>

        {err && <div className="error-text">{err}</div>}

        <button type="submit" disabled={saving} className="btn btn-primary" style={{ background: accent }}>
          {saving ? "Saving…" : "Save & see matches"}
        </button>
      </form>
    </div>
  );
}
