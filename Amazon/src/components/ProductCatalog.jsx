import React from "react";
import { Star, Check } from "lucide-react";
import { useAmazon } from "../context/AmazonContext";

export const ProductCatalog = () => {
  const {
    products,
    openProductDetail,
    addToCart,
    selectedCategory,
    searchQuery
  } = useAmazon();

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "All Categories" ? true : p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20, width: "100%" }}>
      {/* Banner */}
      <div
        style={{
          width: "100%",
          height: 180,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#232f3e",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          marginBottom: 24,
          backgroundImage: "linear-gradient(135deg, #131921 0%, #232f3e 100%)"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 6 }}>
            Deals on Electronics & Tech ⚡
          </h2>
          <p style={{ fontSize: "1rem", opacity: 0.9 }}>
            Free Same-Day Delivery for Prime Members in San Francisco
          </p>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "var(--amz-card-bg)",
              borderRadius: 8,
              border: "1px solid var(--amz-border)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div
              onClick={() => openProductDetail(product)}
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: 6,
                  overflow: "hidden",
                  backgroundColor: "#fff"
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {product.title}
              </h3>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", color: "#ffa41c" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="#ffa41c" color="#ffa41c" />
                  ))}
                </div>
                <span style={{ color: "#007185", fontWeight: 700 }}>{product.rating}</span>
                <span style={{ color: "var(--text-secondary)" }}>({product.reviewsCount.toLocaleString()})</span>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textDecoration: "line-through" }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Prime Badge */}
              {product.isPrime && (
                <div style={{ fontSize: "0.85rem" }}>
                  <span className="prime-badge">✓prime</span>
                  <span style={{ color: "var(--text-secondary)", marginLeft: 6, fontSize: "0.78rem" }}>
                    FREE One-Day
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <button
              className="btn-amz-yellow"
              onClick={() => addToCart(product, 1)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
