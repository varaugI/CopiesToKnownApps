import React, { useState } from "react";
import { X, Camera } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const EditProfileModal = () => {
  const { isEditProfileModalOpen, setIsEditProfileModalOpen, user, updateUserProfile } = useApp();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [website, setWebsite] = useState(user.website);
  const [avatar, setAvatar] = useState(user.avatar);

  if (!isEditProfileModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ name, username, bio, website, avatar });
    setIsEditProfileModalOpen(false);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsEditProfileModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          <div style={{ width: 24 }} />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Edit profile</h3>
          <button
            onClick={() => setIsEditProfileModalOpen(false)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Avatar Edit */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--bg-secondary)",
              padding: "12px 16px",
              borderRadius: "12px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img
                src={avatar}
                alt="Avatar"
                style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user.username}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.name}</div>
              </div>
            </div>

            <label
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "white",
                padding: "6px 14px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              Change photo
              <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: "none" }} />
            </label>
          </div>

          {/* Form Inputs */}
          <div>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 6, display: "block" }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                outline: "none",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 6, display: "block" }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                outline: "none",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 6, display: "block" }}>Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                outline: "none",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 6, display: "block" }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: "100%",
                height: 80,
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                outline: "none",
                resize: "none",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              marginTop: 10
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
