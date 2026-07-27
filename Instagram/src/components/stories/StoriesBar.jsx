import React from "react";
import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "../../context/profile-context";
import { useStories } from "../../context/stories-context";
import { useUi } from "../../context/ui-context";

export const StoriesBar = () => {
  const { stories } = useStories();
  const { user } = useProfile();
  const { setIsCreateModalOpen } = useUi();
  const navigate = useNavigate();
  const location = useLocation();

  const openStory = (storyGroup) => {
    const firstStory = storyGroup.stories[0];
    if (!firstStory) return;
    navigate(`/stories/${storyGroup.user.username}/${firstStory.id}`, {
      state: { backgroundPath: location.pathname }
    });
  };

  return (
    <div className="stories-bar" aria-label="Stories">
      <button type="button" className="story-item" onClick={() => setIsCreateModalOpen(true)}>
        <div style={{ position: "relative" }}>
          <div className="story-avatar-wrapper">
            <img src={user.avatar} alt="" className="story-avatar" />
          </div>
          <div
            aria-hidden="true"
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
      </button>

      {stories.map((storyGroup) => (
        <button
          type="button"
          key={storyGroup.id}
          className="story-item"
          onClick={() => openStory(storyGroup)}
        >
          <div className={`story-ring ${storyGroup.hasUnseen ? "unseen" : "seen"}`}>
            <div className="story-avatar-wrapper">
              <img
                src={storyGroup.user.avatar}
                alt=""
                className="story-avatar"
              />
            </div>
          </div>
          <span className="story-username">{storyGroup.user.username}</span>
        </button>
      ))}
    </div>
  );
};
