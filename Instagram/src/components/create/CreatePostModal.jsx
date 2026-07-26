import React, { useState } from "react";
import { X, Image as ImageIcon, MapPin, Smile, ArrowLeft, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";

const FILTERS = [
  { name: "Normal", filter: "none" },
  { name: "Clarendon", filter: "contrast(1.2) saturate(1.35)" },
  { name: "Gingham", filter: "hue-rotate(-10deg) brightness(1.05)" },
  { name: "Moon", filter: "grayscale(1) contrast(1.1) brightness(0.9)" },
  { name: "Lark", filter: "brightness(1.15) saturate(1.1)" },
  { name: "Reyes", filter: "sepia(0.35) contrast(0.9) brightness(1.1)" },
  { name: "Juno", filter: "contrast(1.15) saturate(1.4) sepia(0.1)" },
  { name: "Slumber", filter: "saturate(0.65) brightness(1.05)" }
];

export const CreatePostModal = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createPost, user } = useApp();

  const [selectedImage, setSelectedImage] = useState(
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80"
  );
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState(1); // 1: Pick/Upload, 2: Filter & Caption

  if (!isCreateModalOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    createPost({
      images: [selectedImage],
      caption,
      location
    });
    // Reset & close
    setStep(1);
    setCaption("");
    setLocation("");
    setIsCreateModalOpen(false);
  };

  const handleClose = () => {
    setStep(1);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: step === 2 ? 800 : 500, transition: "var(--transition-smooth)" }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div style={{ width: 20 }} />
          )}

          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Create new post</h3>

          {step === 2 ? (
            <button
              onClick={handlePublish}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-blue)",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Share
            </button>
          ) : (
            <button
              onClick={handleClose}
              style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          )}
        </header>

        {/* Content Body */}
        {step === 1 ? (
          <div
            style={{
              height: 380,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: 24
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ImageIcon size={44} color="var(--text-muted)" />
            </div>

            <p style={{ fontSize: "1.2rem", fontWeight: 500 }}>Drag photos and videos here</p>

            <label
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Select from computer
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </label>

            {/* Quick Presets */}
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>or choose a preset image:</span>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {[
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80"
                ].map((preset, i) => (
                  <img
                    key={i}
                    src={preset}
                    alt="Preset"
                    onClick={() => {
                      setSelectedImage(preset);
                      setStep(2);
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "2px solid transparent"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Edit & Filter */
          <div style={{ display: "flex", height: 460 }}>
            {/* Left Preview */}
            <div
              style={{
                flex: 1.2,
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: selectedFilter
                }}
              />
            </div>

            {/* Right Editor Controls */}
            <div
              style={{
                flex: 1,
                borderLeft: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* User Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user.username}</span>
              </div>

              {/* Caption Input */}
              <div style={{ padding: "0 16px" }}>
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  style={{
                    width: "100%",
                    height: 90,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    resize: "none",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              {/* Location input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  borderTop: "1px solid var(--border-color)",
                  borderBottom: "1px solid var(--border-color)"
                }}
              >
                <input
                  type="text"
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    width: "100%"
                  }}
                />
                <MapPin size={18} color="var(--text-muted)" />
              </div>

              {/* Filters Carousel */}
              <div style={{ padding: "12px 16px", flex: 1, overflowY: "auto" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  Photo Filters
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                    marginTop: 8
                  }}
                >
                  {FILTERS.map((f) => (
                    <div
                      key={f.name}
                      onClick={() => setSelectedFilter(f.filter)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer"
                      }}
                    >
                      <img
                        src={selectedImage}
                        alt={f.name}
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 6,
                          objectFit: "cover",
                          filter: f.filter,
                          border: selectedFilter === f.filter ? "2px solid var(--accent-blue)" : "2px solid transparent"
                        }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-primary)" }}>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
