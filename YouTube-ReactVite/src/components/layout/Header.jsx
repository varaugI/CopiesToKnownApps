import React, { useState } from "react";
import { Menu, Search, Mic, Video, Bell, User, Clock } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";
import { YouTubeLogo } from "../common/YouTubeLogo";

export const Header = () => {
  const {
    setActiveView,
    searchQuery,
    setSearchQuery,
    searchSuggestions,
    user,
    setIsUploadModalOpen
  } = useYouTube();

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSuggestionsOpen(false);
      setActiveView("search");
    }
  };

  const filteredSuggestions = searchSuggestions.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="yt-header">
      {/* Left: Menu & Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
        >
          <Menu size={22} />
        </button>
        <div onClick={() => setActiveView("home")}>
          <YouTubeLogo size={22} />
        </div>
      </div>

      {/* Center: Search Bar with Suggestions Dropdown */}
      <form
        onSubmit={handleSearchSubmit}
        style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 640, margin: "0 20px", position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            backgroundColor: "var(--yt-dark-body)",
            border: "1px solid var(--yt-border)",
            borderRadius: "40px 0 0 40px",
            padding: "8px 16px"
          }}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSuggestionsOpen(true);
            }}
            onFocus={() => setIsSuggestionsOpen(true)}
            onBlur={() => setTimeout(() => setIsSuggestionsOpen(false), 200)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.95rem"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "var(--yt-dark-card)",
            border: "1px solid var(--yt-border)",
            borderLeft: "none",
            borderRadius: "0 40px 40px 0",
            padding: "8px 20px",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
          title="Search"
        >
          <Search size={20} />
        </button>

        {/* Auto-suggest Dropdown */}
        {isSuggestionsOpen && searchQuery.trim() && filteredSuggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              right: 80,
              backgroundColor: "var(--yt-dark-card)",
              border: "1px solid var(--yt-border)",
              borderRadius: 16,
              padding: "10px 0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
              zIndex: 200
            }}
          >
            {filteredSuggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(s);
                  setIsSuggestionsOpen(false);
                  setActiveView("search");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Clock size={16} color="var(--text-muted)" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          style={{
            backgroundColor: "var(--yt-dark-card)",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
          title="Search with your voice"
        >
          <Mic size={20} />
        </button>
      </form>

      {/* Right: Upload, Notifications, Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "var(--yt-dark-card)",
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer"
          }}
        >
          <Video size={18} />
          <span>Create</span>
        </button>

        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={22} color="var(--text-primary)" />
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: "var(--yt-red)",
              color: "white",
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "1px 4px",
              borderRadius: 10
            }}
          >
            3
          </span>
        </div>

        <div
          onClick={() => setActiveView("channel")}
          style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}
        >
          <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </header>
  );
};
