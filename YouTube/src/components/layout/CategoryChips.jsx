import React from "react";
import { useYouTube } from "../../context/YouTubeContext";

export const CategoryChips = () => {
  const { categories, selectedCategory, setSelectedCategory } = useYouTube();

  return (
    <div className="category-chips-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip-pill ${selectedCategory === cat ? "active" : ""}`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
