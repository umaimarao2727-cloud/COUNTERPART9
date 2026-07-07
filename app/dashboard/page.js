import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreMatch } from "@/lib/matching";
import MatchList from "./MatchList";
import IncomingRequests from "./IncomingRequests";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/profile");

  const oppositeRole = profile.role === "business" ? "manager" : "business";
  const { data: candidates } = await supabase.from("profiles").select("*").eq("role", oppositeRole);

  const { data: savedRows } = await supabase.from("saved_matches").select("matched_id").eq("user_id", user.id);
  const savedIds = (savedRows || []).map((r) => r.matched_id);

  const { data: outgoing } = await supabase.from("intro_requests").select("*").eq("requester_id", user.id);
  const { data: incoming } = await supabase.from("intro_requests").select("*").eq("target_id", user.id);

  // attach the sender's profile info to each incoming request
  const incomingWithProfiles = [];
  for (const req of incoming || []) {
    const { data: senderProfile } = await supabase.from("profiles").select("*").eq("id", req.requester_id).single();
    incomingWithProfiles.push({ ...req, sender: senderProfile });
  }

  const ranked = (candidates || [])
    .map((c) => ({ ...c, score: scoreMatch(profile, c) }))
    .sort((a, b) => b.score - a.score);

  const oppositeLabel = profile.role === "business" ? "managers" : "clients";

  return (
    <div className="wrap" style={{ padding: "48px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {profile.name} · {profile.role === "business" ? "Business" : "Manager"}
          </div>
          <h1 style={{ fontSize: 28 }}>{ranked.length} {oppositeLabel} match your profile</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/profile" className="btn btn-ghost">Edit profile</a>
          <a href="/auth/signout" className="btn btn-ghost">Log out</a>
        </div>
      </div>

      <IncomingRequests requests={incomingWithProfiles} />

      {ranked.length === 0 ? (
        <div className="card" style={{ color: "var(--muted)", fontSize: 14 }}>
          No {oppositeLabel} have joined yet — check back soon.
        </div>
      ) : (
        <MatchList matches={ranked} savedIds={savedIds} viewerRole={profile.role} outgoingRequests={outgoing || []} />
      )}
    </div>
  );
}
