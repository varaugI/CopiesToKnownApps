import React, { useCallback, useState, useEffect } from "react";
import { X, Heart, Send, Pause, Play } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStories } from "../../context/stories-context";

const EMPTY_STORIES = [];

export const StoryViewer = () => {
  const { username = "", storyId = "" } = useParams();
  const { findStoryGroup, markStoryAsSeen, stories } = useStories();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReacted, setIsReacted] = useState(false);
  const activeStoryGroup = findStoryGroup(username);
  const currentStoriesList = activeStoryGroup?.stories || EMPTY_STORIES;
  const currentIndex = currentStoriesList.findIndex((story) => story.id === storyId);
  const currentStory = currentIndex >= 0 ? currentStoriesList[currentIndex] : undefined;

  useEffect(() => {
    if (activeStoryGroup) {
      markStoryAsSeen(activeStoryGroup.id);
    }
  }, [activeStoryGroup, markStoryAsSeen]);

  useEffect(() => {
    setIsReacted(false);
    setReplyText("");
  }, [storyId]);

  const close = useCallback(() => {
    const state = location.state;
    const backgroundPath =
      state && typeof state === "object" && "backgroundPath" in state
        ? state.backgroundPath
        : "/";
    navigate(typeof backgroundPath === "string" ? backgroundPath : "/", { replace: true });
  }, [location.state, navigate]);

  const handleNext = useCallback(() => {
    if (!activeStoryGroup) return;
    if (currentIndex < currentStoriesList.length - 1) {
      const nextStory = currentStoriesList[currentIndex + 1];
      if (nextStory) {
        navigate(`/stories/${activeStoryGroup.user.username}/${nextStory.id}`, {
          replace: true,
          state: location.state
        });
      }
    } else {
      const currentGroupIndex = stories.findIndex((g) => g.id === activeStoryGroup.id);
      if (currentGroupIndex < stories.length - 1) {
        const nextGroup = stories[currentGroupIndex + 1];
        const nextStory = nextGroup?.stories[0];
        if (nextGroup && nextStory) {
          navigate(`/stories/${nextGroup.user.username}/${nextStory.id}`, {
            replace: true,
            state: location.state
          });
        }
      } else {
        close();
      }
    }
  }, [activeStoryGroup, close, currentIndex, currentStoriesList, location.state, navigate, stories]);

  useEffect(() => {
    if (!currentStory || isPaused) return undefined;
    const timer = setTimeout(handleNext, 5000);
    return () => clearTimeout(timer);
  }, [currentStory, handleNext, isPaused]);

  if (!activeStoryGroup) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      const previousStory = currentStoriesList[currentIndex - 1];
      if (previousStory) {
        navigate(`/stories/${activeStoryGroup.user.username}/${previousStory.id}`, {
          replace: true,
          state: location.state
        });
      }
    } else {
      const currentGroupIndex = stories.findIndex((g) => g.id === activeStoryGroup.id);
      if (currentGroupIndex > 0) {
        const previousGroup = stories[currentGroupIndex - 1];
        const previousStory = previousGroup?.stories.at(-1);
        if (previousGroup && previousStory) {
          navigate(`/stories/${previousGroup.user.username}/${previousStory.id}`, {
            replace: true,
            state: location.state
          });
        }
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-label="Story viewer"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.92)", zIndex: 2000 }}
    >
      {/* Close button */}
      <button
        type="button"
        aria-label="Close story viewer"
        onClick={close}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          zIndex: 2010
        }}
      >
        <X size={32} />
      </button>

      {/* Main Story Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          height: "90vh",
          maxHeight: "750px",
          backgroundColor: "#121212",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
        }}
      >
        {/* Progress Bar Header */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            gap: "4px",
            zIndex: 2005
          }}
        >
          {currentStoriesList.map((st, idx) => (
            <div
              key={st.id}
              style={{
                flex: 1,
                height: "3px",
                backgroundColor: "rgba(255,255,255,0.35)",
                borderRadius: "2px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#ffffff",
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? "100%" : "0%",
                  transition: idx === currentIndex && !isPaused ? "width 5s linear" : "none"
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info Bar */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 16,
            right: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            zIndex: 2005
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={activeStoryGroup.user.avatar}
              alt={activeStoryGroup.user.username}
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
              {activeStoryGroup.user.username}
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {currentStory?.timestamp}
            </span>
          </div>

          <button
            type="button"
            aria-label={isPaused ? "Play story" : "Pause story"}
            onClick={() => setIsPaused(!isPaused)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>

        {/* Story Media */}
        <div style={{ flex: 1, position: "relative", backgroundColor: "#000" }}>
          {currentStory && (
            <img
              src={currentStory.media}
              alt="Story"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {/* Caption Overlay */}
          {currentStory?.caption && (
            <div
              style={{
                position: "absolute",
                bottom: 80,
                left: 16,
                right: 16,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                padding: "8px 14px",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.9rem",
                textAlign: "center"
              }}
            >
              {currentStory.caption}
            </div>
          )}

          {/* Nav Click Areas */}
          <button
            type="button"
            aria-label="Previous story"
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 80,
              width: "30%",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          />
          <button
            type="button"
            aria-label="Next story"
            onClick={handleNext}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 80,
              width: "30%",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          />
        </div>

        {/* Footer Reply & React */}
        <div
          style={{
            height: "70px",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#000"
          }}
        >
          <input
            type="text"
            aria-label={`Reply to ${activeStoryGroup.user.username}`}
            placeholder={`Reply to ${activeStoryGroup.user.username}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "#262626",
              border: "1px solid #363636",
              borderRadius: "20px",
              padding: "10px 16px",
              color: "white",
              fontSize: "0.88rem",
              outline: "none"
            }}
          />
          <button
            type="button"
            aria-label={isReacted ? "Remove story reaction" : "React to story"}
            onClick={() => setIsReacted(!isReacted)}
            style={{ background: "none", border: "none", cursor: "pointer", color: isReacted ? "#ff3040" : "white" }}
          >
            <Heart size={26} fill={isReacted ? "#ff3040" : "none"} />
          </button>
          <button
            type="button"
            aria-label="Send story reply"
            onClick={() => {
              if (replyText.trim()) setReplyText("");
            }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
