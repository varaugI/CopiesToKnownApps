import React from "react";
import { Users, MapPin, Link as LinkIcon, Building, Star, BookOpen } from "lucide-react";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { useGitHub } from "../../context/GitHubContext";

export const ProfileView = () => {
  const { user, repos, openRepo } = useGitHub();

  return (
    <div className="gh-content-wrapper" style={{ display: "flex", gap: 32 }}>
      {/* Left User Profile Details */}
      <aside style={{ width: 280, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Avatar */}
        <div style={{ position: "relative", width: 260, height: 260, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--gh-border)" }}>
          <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Names */}
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{user.name}</h1>
          <h2 style={{ fontSize: "1.1rem", color: "var(--text-secondary)", fontWeight: 500 }}>{user.username}</h2>
        </div>

        {/* Bio */}
        <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.4, whiteSpace: "pre-line" }}>
          {user.bio}
        </p>

        <button className="btn-gh-secondary" style={{ width: "100%", justifyContent: "center" }}>
          Edit profile
        </button>

        {/* Social Metrics */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.88rem" }}>
          <Users size={16} color="var(--text-secondary)" />
          <strong>{user.followersCount}</strong>
          <span style={{ color: "var(--text-secondary)" }}>followers</span>
          <span style={{ margin: "0 4px" }}>·</span>
          <strong>{user.followingCount}</strong>
          <span style={{ color: "var(--text-secondary)" }}>following</span>
        </div>

        {/* Meta Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.88rem", color: "var(--text-primary)" }}>
          {user.company && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building size={16} color="var(--text-secondary)" />
              <span>{user.company}</span>
            </div>
          )}

          {user.location && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={16} color="var(--text-secondary)" />
              <span>{user.location}</span>
            </div>
          )}

          {user.website && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LinkIcon size={16} color="var(--text-secondary)" />
              <a href={user.website} target="_blank" rel="noreferrer" style={{ color: "var(--gh-blue)", textDecoration: "none" }}>
                {user.website.replace("https://", "")}
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* Right Column: Pinned Repositories & Heatmap */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Pinned Repositories</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {repos.map((r) => (
            <div
              key={r.id}
              onClick={() => openRepo(r.id, "code")}
              style={{
                backgroundColor: "var(--gh-dark-panel)",
                border: "1px solid var(--gh-border)",
                borderRadius: 6,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 12,
                cursor: "pointer"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <BookOpen size={16} color="var(--text-secondary)" />
                  <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--gh-blue)" }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", border: "1px solid var(--gh-border)", borderRadius: 10, padding: "1px 6px" }}>
                    Public
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {r.description}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: r.languageColor }} />
                  <span>{r.primaryLanguage}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={14} />
                  <span>{r.starsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contribution Activity Heatmap */}
        <ContributionHeatmap />
      </main>
    </div>
  );
};
