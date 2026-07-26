import React, { useState } from "react";
import { X, Camera } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const EditProfileModal = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, user, updateUserProfile } = useTikTok();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ name, username, bio, avatar });
    setIsEditProfileOpen(false);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setIsEditProfileOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-color)",
          padding: 24
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Edit profile</h3>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Avatar Change */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <img
              src={avatar}
              alt="Avatar"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
            />
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--tiktok-cyan)",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Change photo
              <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: "none" }} />
            </label>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 4, display: "block" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border-color)",
                color: "white",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 4, display: "block" }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border-color)",
                color: "white",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 4, display: "block" }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: "100%",
                height: 70,
                padding: 10,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border-color)",
                color: "white",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          <button
            type="submit"
            className="tiktok-btn-primary"
            style={{ padding: 12, justifyContent: "center", marginTop: 10 }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
