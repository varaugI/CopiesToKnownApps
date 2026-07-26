import React from "react";
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";
import { ActiveCallModal } from "./ActiveCallModal";

export const CallsTab = () => {
  const { callsLog, startCall } = useWhatsApp();

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Calls</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {callsLog.map((call) => (
          <div
            key={call.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img
                src={call.contact.avatar}
                alt={call.contact.name}
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
              />

              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{call.contact.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  {call.isMissed ? (
                    <PhoneMissed size={14} color="#ff3040" />
                  ) : call.type === "incoming" ? (
                    <PhoneIncoming size={14} color="var(--wa-emerald)" />
                  ) : (
                    <PhoneOutgoing size={14} color="var(--wa-emerald)" />
                  )}
                  <span>{call.timestamp}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startCall(call.contact, call.callType)}
              style={{
                background: "none",
                border: "none",
                color: "var(--wa-emerald)",
                cursor: "pointer",
                padding: 8
              }}
            >
              {call.callType === "video" ? <Video size={20} /> : <Phone size={20} />}
            </button>
          </div>
        ))}
      </div>

      <ActiveCallModal />
    </div>
  );
};
