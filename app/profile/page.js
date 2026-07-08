"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SERVICE_OPTIONS = [
  "Content creation",
  "Ads management",
  "Community management",
  "Strategy & planning",
  "Copywriting",
  "Analytics & reporting",
];

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "business",
    niche: "",
    budget: "",
    bio: "",
    portfolio_link: "",
    services_offered: [],
    accepting_clients: true,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile) setForm({ ...profile, services_offered: profile.services_offered || [], accepting_clients: profile.accepting_clients !== false });
      setLoading(false);
    })();
  }, []);

  function toggleService(service) {
    setForm((prev) => {
      const current = prev.services_offered || [];
      const next = current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service];
      return { ...prev, services_offered: next };
    });
  }

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
      email: user.email,
      portfolio_link: form.portfolio_link || "",
      services_offered: form.role === "manager" ? (form.services_offered || []) : [],
      accepting_clients: form.role === "manager" ? form.accepting_clients !== false : true,
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
          {form.role === "business" ? "Business website (optional)" : "Portfolio or social link"}
          <input
            className="input"
            value={form.portfolio_link || ""}
            onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })}
            placeholder={form.role === "business" ? "https://yourbusiness.com" : "https://instagram.com/yourhandle"}
          />
        </label>

        {form.role === "manager" && (
          <div className="field">
            Services you offer
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {SERVICE_OPTIONS.map((service) => {
                const checked = (form.services_offered || []).includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    style={{
                      padding: "8px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      border: `1px solid ${checked ? "var(--brass)" : "var(--line)"}`,
                      background: checked ? "var(--brass-dim)" : "white",
                      color: "var(--ink)",
                      borderRadius: 2,
                    }}
                  >
                    {checked ? "✓ " : ""}{service}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {form.role === "manager" && (
          <div className="field">
            Availability
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {[
                { label: "Accepting new clients", value: true },
                { label: "Not taking new clients right now", value: false },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setForm({ ...form, accepting_clients: opt.value })}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1px solid ${form.accepting_clients === opt.value ? "var(--brass)" : "var(--line)"}`,
                    background: form.accepting_clients === opt.value ? "var(--brass-dim)" : "white",
                    color: "var(--ink)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
