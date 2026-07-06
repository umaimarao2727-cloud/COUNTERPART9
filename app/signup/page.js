"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setNotice("");
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    if (data.session) {
      // Email confirmation is off in this project — go straight to profile setup.
      router.push("/profile");
    } else {
      setNotice("Check your inbox for a confirmation link, then come back and log in.");
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: 420, padding: "80px 24px" }}>
      <Link href="/" className="mono" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Counterpart</Link>
      <h1 style={{ fontSize: 28, margin: "16px 0 8px" }}>Create your account</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
        You'll set up your business or manager profile next.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label className="field">
          Email
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="field">
          Password
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </label>

        {err && <div className="error-text">{err}</div>}
        {notice && <div style={{ fontSize: 13, color: "var(--teal)" }}>{notice}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: "var(--teal)", justifyContent: "center" }}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 24 }}>
        Already have an account? <Link href="/login" style={{ color: "var(--ink)", fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
}
