import React from "react";
import { Play, Plus, Check, Info } from "lucide-react";
import { usePrime } from "../context/PrimeContext";

export const HeroBanner = () => {
  const { activeHero, playVideo, watchlist, toggleWatchlist } = usePrime();

  if (!activeHero) return null;

  const isInWatchlist = watchlist.some((i) => i.id === activeHero.id);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "80vh",
        maxHeight: 650,
        marginTop: 64,
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 20%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.95) 100%), url(${activeHero.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "0 60px"
      }}
    >
      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 900,
            color: "var(--prime-blue)",
            letterSpacing: "1px"
          }}
        >
          {activeHero.badge}
        </span>

        <h1 style={{ fontSize: "2.8rem", fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase" }}>
          {activeHero.title}
        </h1>

        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)", display: "flex", gap: 12 }}>
          <span>{activeHero.rating}</span>
          <span>•</span>
          <span>{activeHero.resolution}</span>
          <span>•</span>
          <span>{activeHero.duration}</span>
        </div>

        <p style={{ fontSize: "1rem", lineHeight: 1.5, color: "var(--text-primary)" }}>
          {activeHero.description}
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
          <button className="btn-prime-blue" onClick={() => playVideo(activeHero)}>
            <Play size={20} fill="white" />
            <span>Watch Now</span>
          </button>

          <button
            onClick={() => toggleWatchlist(activeHero)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid var(--prime-border)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            title="Watchlist"
          >
            {isInWatchlist ? <Check size={20} color="var(--prime-blue)" /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
