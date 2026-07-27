import React from "react";
import { Sun, Moon, Image as ImageIcon, Shield, Bell } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const SettingsDrawer: React.FC = () => {
  const { theme, toggleTheme, wallpaper, setWallpaper } = useWhatsApp();

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Settings</h2>

      {/* Theme Settings */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {theme === "dark" ? <Moon size={20} color="var(--wa-emerald)" /> : <Sun size={20} color="var(--wa-emerald)" />}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Theme</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Currently {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: "var(--wa-emerald)",
              color: "#111b21",
              border: "none",
              borderRadius: 20,
              padding: "6px 14px",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            Switch
          </button>
        </div>
      </div>

      {/* Wallpaper Setting */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <ImageIcon size={20} color="var(--wa-emerald)" />
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Chat Wallpaper</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { id: "default", name: "Doodle" },
            { id: "emerald", name: "Emerald" },
            { id: "dark", name: "Solid Dark" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setWallpaper(item.id)}
              style={{
                padding: "10px 0",
                backgroundColor: wallpaper === item.id ? "rgba(0, 168, 132, 0.2)" : "rgba(255,255,255,0.06)",
                border: wallpaper === item.id ? "2px solid var(--wa-emerald)" : "1px solid var(--wa-border)",
                borderRadius: 8,
                color: "white",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer"
        }}
      >
        <Shield size={20} color="var(--wa-emerald)" />
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Privacy</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Block contacts, disappearing messages
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div
        style={{
          backgroundColor: "var(--wa-dark-body)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--wa-border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer"
        }}
      >
        <Bell size={20} color="var(--wa-emerald)" />
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Notifications</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Message preview tones & alerts
          </div>
        </div>
      </div>
    </div>
  );
};
