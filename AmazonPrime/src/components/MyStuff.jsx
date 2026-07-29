import React from "react";
import { Bookmark, Play } from "lucide-react";
import { usePrime } from "../context/PrimeContext";

export const MyStuff = () => {
  const { watchlist, playVideo } = usePrime();

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "100px 40px 40px 40px", width: "100%" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 24 }}>My Stuff - Watchlist</h1>

      {watchlist.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
          Your Watchlist is empty. Add movies and TV shows to watch them later.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {watchlist.map((item) => (
            <div
              key={item.id}
              onClick={() => playVideo(item)}
              style={{
                aspectRatio: "16 / 9",
                borderRadius: 10,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                backgroundColor: "var(--prime-card)"
              }}
            >
              <img
                src={item.bgImage || item.poster}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Play size={40} fill="white" color="white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
