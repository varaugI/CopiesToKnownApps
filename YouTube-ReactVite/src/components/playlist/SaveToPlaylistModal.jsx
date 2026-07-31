import React, { useState } from "react";
import { X, Plus, Bookmark, Lock, Globe } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const SaveToPlaylistModal = () => {
  const {
    isSaveToPlaylistModalOpen,
    setIsSaveToPlaylistModalOpen,
    playlists,
    createNewPlaylist
  } = useYouTube();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  if (!isSaveToPlaylistModalOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createNewPlaylist(newTitle, isPrivate);
      setNewTitle("");
      setIsCreatingNew(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setIsSaveToPlaylistModalOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "var(--yt-dark-card)",
          borderRadius: 16,
          border: "1px solid var(--yt-border)",
          padding: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: "1rem" }}>Save video to...</span>
          <button
            onClick={() => setIsSaveToPlaylistModalOpen(false)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Playlists List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {playlists.map((pl) => (
            <label key={pl.id} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: "0.9rem" }}>
              <input type="checkbox" defaultChecked={pl.title === "Watch Later"} />
              <span style={{ flex: 1, fontWeight: 600 }}>{pl.title}</span>
              {pl.isPrivate ? <Lock size={14} color="var(--text-muted)" /> : <Globe size={14} color="var(--text-muted)" />}
            </label>
          ))}
        </div>

        {/* Create New Playlist Button / Form */}
        {!isCreatingNew ? (
          <button
            onClick={() => setIsCreatingNew(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              padding: "8px 0"
            }}
          >
            <Plus size={18} />
            <span>Create new playlist</span>
          </button>
        ) : (
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid var(--yt-border)", paddingTop: 12 }}>
            <input
              type="text"
              placeholder="Name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: "var(--yt-dark-body)",
                border: "1px solid var(--yt-border)",
                color: "white",
                outline: "none"
              }}
            />

            <select
              value={isPrivate ? "private" : "public"}
              onChange={(e) => setIsPrivate(e.target.value === "private")}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: "var(--yt-dark-body)",
                border: "1px solid var(--yt-border)",
                color: "white",
                outline: "none"
              }}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                style={{ background: "none", border: "none", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: "var(--yt-red)",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 16px",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
