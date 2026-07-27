import React from "react";
import { Heart, MessageCircle, Film } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePosts } from "../../context/posts-context";

export const Explore = () => {
  const { explorePosts, posts } = usePosts();
  const navigate = useNavigate();
  const location = useLocation();

  const allGridPosts = [
    ...posts.map((post) => ({
      id: post.id,
      image: post.images[0],
      likes: post.likesCount,
      comments: post.comments.length,
      type: "photo"
    })),
    ...explorePosts
  ];

  const openPost = (postId) => {
    navigate(`/p/${postId}`, { state: { backgroundPath: location.pathname } });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="explore-grid">
        {allGridPosts.map((item) => (
          <div
            key={item.id}
            className="explore-item"
            role="link"
            tabIndex={0}
            onClick={() => openPost(item.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPost(item.id);
              }
            }}
          >
            <img src={item.image} alt="Explore item" className="explore-media" />

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

            {item.type === "reel" && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "white",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
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
