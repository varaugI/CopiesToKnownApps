import React, { useState } from "react";
import { Edit2, Check, Camera } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const ProfileDrawer: React.FC = () => {
  const { user, updateUserProfile } = useWhatsApp();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          updateUserProfile({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    updateUserProfile({ name });
    setIsEditingName(false);
  };

  const saveAbout = () => {
    updateUserProfile({ about });
    setIsEditingAbout(false);
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Profile</h2>

      {/* Profile Photo */}
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
        <div style={{ position: "relative" }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover" }}
          />
          <label
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              backgroundColor: "var(--wa-emerald)",
              color: "#111b21",
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
            }}
          >
            <Camera size={20} />
            <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      {/* Your Name */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)"
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "var(--wa-emerald)", fontWeight: 700, marginBottom: 8 }}>
          Your name
        </div>

        {isEditingName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "2px solid var(--wa-emerald)",
                color: "white",
                outline: "none",
                fontSize: "1rem",
                padding: "4px 0"
              }}
            />
            <button
              onClick={saveName}
              style={{ background: "none", border: "none", color: "var(--wa-emerald)", cursor: "pointer" }}
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "1rem", fontWeight: 600 }}>{user.name}</span>
            <button
              onClick={() => setIsEditingName(true)}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              <Edit2 size={18} />
            </button>
          </div>
        )}
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 8 }}>
          This is not your username or pin. This name will be visible to your ConnectChat contacts.
        </div>
      </div>

      {/* About */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)"
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "var(--wa-emerald)", fontWeight: 700, marginBottom: 8 }}>
          About
        </div>

        {isEditingAbout ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "2px solid var(--wa-emerald)",
                color: "white",
                outline: "none",
                fontSize: "0.95rem",
                padding: "4px 0"
              }}
            />
            <button
              onClick={saveAbout}
              style={{ background: "none", border: "none", color: "var(--wa-emerald)", cursor: "pointer" }}
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.95rem" }}>{user.about}</span>
            <button
              onClick={() => setIsEditingAbout(true)}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              <Edit2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Phone Number */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)"
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "var(--wa-emerald)", fontWeight: 700, marginBottom: 6 }}>
          Phone number
        </div>
        <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{user.phone}</div>
      </div>
    </div>
  );
};
