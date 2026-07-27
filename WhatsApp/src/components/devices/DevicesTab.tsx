import React, { useState } from "react";
import { Laptop, Smartphone, ShieldCheck, LogOut } from "lucide-react";
import { DeviceSession } from "../../types";

const MOCK_DEVICES: DeviceSession[] = [
  {
    id: "dev_1",
    deviceName: "Windows PC (Current Device)",
    browser: "Chrome 126",
    os: "Windows 11",
    lastActive: "Active now",
    isCurrent: true
  },
  {
    id: "dev_2",
    deviceName: "iPhone 15 Pro",
    browser: "ConnectChat iOS App",
    os: "iOS 17.5",
    lastActive: "Today at 02:14 PM",
    isCurrent: false
  },
  {
    id: "dev_3",
    deviceName: "MacBook Air",
    browser: "Safari 17.4",
    os: "macOS Sonoma",
    lastActive: "Yesterday at 09:30 AM",
    isCurrent: false
  }
];

export const DevicesTab: React.FC = () => {
  const [devices, setDevices] = useState<DeviceSession[]>(MOCK_DEVICES);

  const handleLogoutDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const handleLogoutAll = () => {
    setDevices((prev) => prev.filter((d) => d.isCurrent));
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Linked Devices</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: -12 }}>
        Manage active device sessions linked to your ConnectChat account.
      </p>

      {/* Linked Devices Status Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          backgroundColor: "rgba(0, 168, 132, 0.1)",
          borderRadius: 12,
          border: "1px solid rgba(0, 168, 132, 0.3)"
        }}
      >
        <ShieldCheck size={24} color="var(--wa-emerald)" />
        <div style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>
          Multi-device synchronization is enabled. Your messages sync seamlessly across active sessions.
        </div>
      </div>

      {/* Active Sessions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {devices.map((device) => (
          <div
            key={device.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              backgroundColor: "var(--wa-dark-body)",
              borderRadius: 12,
              border: "1px solid var(--wa-border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {device.isCurrent ? (
                <Laptop size={28} color="var(--wa-emerald)" />
              ) : (
                <Smartphone size={28} color="var(--text-secondary)" />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  {device.deviceName}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {device.browser} · {device.os}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--wa-emerald)", marginTop: 2 }}>
                  {device.lastActive}
                </div>
              </div>
            </div>

            {!device.isCurrent && (
              <button
                onClick={() => handleLogoutDevice(device.id)}
                style={{
                  backgroundColor: "rgba(255, 48, 64, 0.15)",
                  color: "#ff4d4d",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <LogOut size={14} />
                Log out
              </button>
            )}
          </div>
        ))}
      </div>

      {devices.length > 1 && (
        <button
          onClick={handleLogoutAll}
          style={{
            backgroundColor: "rgba(255, 48, 64, 0.2)",
            color: "#ff4d4d",
            border: "1px solid rgba(255, 48, 64, 0.4)",
            borderRadius: 10,
            padding: "10px 16px",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            marginTop: 10
          }}
        >
          Log out of all other devices
        </button>
      )}
    </div>
  );
};
