import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 600 }} className="">
            <span style={{ width: 10, height: 10, background: "var(--teal)", position: "relative", display: "inline-block" }}>
              <span style={{ position: "absolute", left: 6, top: 6, width: 10, height: 10, background: "var(--brass)" }} />
            </span>
            Counterpart
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/login" className="btn btn-ghost">Log in</Link>
            <Link href="/signup" className="btn btn-primary" style={{ background: "var(--ink)" }}>Get started</Link>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ padding: "88px 24px 64px" }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>A matching platform</div>
        <h1 style={{ fontSize: 46, maxWidth: 640, lineHeight: 1.08 }}>
          Find the social media manager who actually moves your numbers.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 480, marginTop: 20 }}>
          Every manager is vetted for results. Every client has a real budget. Tell us your brief and get matched in days, not weeks.
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          <Link href="/signup" className="btn btn-primary" style={{ background: "var(--teal)" }}>Join as a business</Link>
          <Link href="/signup" className="btn btn-ghost" style={{ borderColor: "var(--ink)" }}>Join as a manager</Link>
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 24px 88px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--line)" }}>
          {[
            ["01", "Tell us the brief", "Industry, goals, budget or rate — takes about four minutes."],
            ["02", "Review your matches", "See real matches ranked by fit, based on niche and budget."],
            ["03", "Start working together", "Reach out and begin the conversation directly."],
          ].map(([num, title, body], i) => (
            <div key={num} style={{ padding: 28, borderRight: i < 2 ? "1px solid var(--line)" : "none" }}>
              <div className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{num}</div>
              <h3 style={{ fontSize: 19, margin: "12px 0 8px" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="wrap" style={{ padding: "0 24px 40px", fontSize: 13, color: "var(--muted)" }}>
        © 2026 Counterpart
      </footer>
    </div>
  );
}
