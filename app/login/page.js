"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="wrap" style={{ maxWidth: 420, padding: "80px 24px" }}>
      <Link href="/" className="mono" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Counterpart</Link>
      <h1 style={{ fontSize: 28, margin: "16px 0 8px" }}>Log in</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>Welcome back.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label className="field">
          Email
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="field">
          Password
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {err && <div className="error-text">{err}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: "var(--ink)", justifyContent: "center" }}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 24 }}>
        No account yet? <Link href="/signup" style={{ color: "var(--ink)", fontWeight: 600 }}>Sign up</Link>
      </p>
    </div>
  );
}
