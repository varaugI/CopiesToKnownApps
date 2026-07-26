import React from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const StoriesBar = () => {
  const { stories, setActiveStoryGroup, user, setIsCreateModalOpen } = useApp();

  return (
    <div className="stories-bar">
      {/* Current User Story Add */}
      <div className="story-item" onClick={() => setIsCreateModalOpen(true)}>
        <div style={{ position: "relative" }}>
          <div className="story-avatar-wrapper">
            <img src={user.avatar} alt={user.username} className="story-avatar" />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              backgroundColor: "var(--accent-blue)",
              color: "white",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--bg-primary)"
            }}
          >
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>
        <span className="story-username">Your story</span>
      </div>

      {/* Other Users Stories */}
      {stories.map((storyGroup) => (
        <div
          key={storyGroup.id}
          className="story-item"
          onClick={() => setActiveStoryGroup(storyGroup)}
        >
          <div className={`story-ring ${storyGroup.hasUnseen ? "unseen" : "seen"}`}>
            <div className="story-avatar-wrapper">
              <img
                src={storyGroup.user.avatar}
                alt={storyGroup.user.username}
                className="story-avatar"
              />
            </div>
          </div>
          <span className="story-username">{storyGroup.user.username}</span>
        </div>
      ))}
    </div>
  );
};
