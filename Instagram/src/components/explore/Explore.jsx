import React from "react";
import { Heart, MessageCircle, Film } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Explore = () => {
  const { explorePosts, setActiveDetailPost, posts } = useApp();

  // Combine default explore posts and feed posts for rich grid
  const allGridPosts = [
    ...posts.map((p) => ({
      id: p.id,
      image: p.images[0],
      likes: p.likesCount,
      comments: p.comments.length,
      type: "photo",
      fullPost: p
    })),
    ...explorePosts.map((e) => ({
      id: e.id,
      image: e.image,
      likes: e.likes,
      comments: e.comments,
      type: e.type
    }))
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="explore-grid">
        {allGridPosts.map((item) => (
          <div
            key={item.id}
            className="explore-item"
            onClick={() => {
              if (item.fullPost) {
                setActiveDetailPost(item.fullPost);
              } else {
                setActiveDetailPost({
                  id: item.id,
                  user: { username: "explore_creator", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
                  images: [item.image],
                  caption: "Featured on Explore feed ✨ #instagram #explore",
                  likesCount: item.likes,
                  isLiked: false,
                  isSaved: false,
                  timestamp: "EXPLORE",
                  comments: []
                });
              }
            }}
          >
            <img src={item.image} alt="Explore item" className="explore-media" />

            {/* Hover overlay stats */}
            <div className="explore-overlay">
              <div className="explore-stat">
                <Heart size={20} fill="white" />
                <span>{item.likes}</span>
              </div>
              <div className="explore-stat">
                <MessageCircle size={20} fill="white" />
                <span>{item.comments}</span>
              </div>
            </div>

            {/* Type Icon Badge */}
            {item.type === "reel" && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "white",
                  dropShadow: "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                <Film size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
