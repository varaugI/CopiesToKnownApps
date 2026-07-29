import React, { useState } from "react";
import { Star, MapPin, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAmazon } from "../context/AmazonContext";

export const ProductDetail = () => {
  const { activeProduct, addToCart, setActiveView } = useAmazon();
  const [quantity, setQuantity] = useState(1);

  if (!activeProduct) return null;

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24, width: "100%" }}>
      <button
        onClick={() => setActiveView("catalog")}
        style={{
          background: "none",
          border: "none",
          color: "#007185",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 20
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to results</span>
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 300px", gap: 32 }}>
        {/* Left Column: Big Image */}
        <div style={{ backgroundColor: "#fff", borderRadius: 8, padding: 20, border: "1px solid var(--amz-border)" }}>
          <img
            src={activeProduct.image}
            alt={activeProduct.title}
            style={{ width: "100%", height: "auto", objectFit: "contain", maxHeight: 450 }}
          />
        </div>

        {/* Center Column: Details & Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.3 }}>
            {activeProduct.title}
          </h1>

          <div style={{ fontSize: "0.9rem", color: "#007185", fontWeight: 600 }}>
            Brand: {activeProduct.brand}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", color: "#ffa41c" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="#ffa41c" color="#ffa41c" />
              ))}
            </div>
            <span style={{ color: "#007185", fontWeight: 700 }}>{activeProduct.rating}</span>
            <span style={{ color: "var(--text-secondary)" }}>({activeProduct.reviewsCount.toLocaleString()} ratings)</span>
          </div>

          <hr style={{ borderColor: "var(--amz-border)" }} />

          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--amz-price)" }}>
              ${activeProduct.price.toFixed(2)}
            </span>
            {activeProduct.originalPrice && (
              <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)", textDecoration: "line-through" }}>
                List Price: ${activeProduct.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 8 }}>About this item</h3>
            <ul style={{ paddingLeft: 20, fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
              {activeProduct.features?.map((feat, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Buy Box */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid var(--amz-border)",
            borderRadius: 8,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: "fit-content"
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--amz-price)" }}>
            ${activeProduct.price.toFixed(2)}
          </div>

          {activeProduct.isPrime && (
            <div>
              <span className="prime-badge">✓prime</span>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: 4 }}>
                FREE One-Day Delivery
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Order within 3 hrs 15 mins
              </div>
            </div>
          )}

          <div style={{ color: "#007600", fontWeight: 800, fontSize: "1.1rem" }}>
            In Stock
          </div>

          {/* Quantity Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem" }}>
            <span>Qty:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--amz-border)" }}
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <button
            className="btn-amz-yellow"
            onClick={() => addToCart(activeProduct, quantity)}
            style={{ width: "100%" }}
          >
            Add to Cart
          </button>

          <button
            className="btn-amz-orange"
            onClick={() => {
              addToCart(activeProduct, quantity);
              setActiveView("cart");
            }}
            style={{ width: "100%" }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
