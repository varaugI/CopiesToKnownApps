import React from "react";
import { Search, ShoppingCart, MapPin, Menu, User, ChevronDown } from "lucide-react";
import { useAmazon } from "../context/AmazonContext";

export const Header = () => {
  const {
    setActiveView,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cartItemsCount
  } = useAmazon();

  return (
    <header className="amz-header">
      {/* Top Main Nav */}
      <div className="amz-header-top">
        {/* Amazon Logo */}
        <div
          onClick={() => setActiveView("catalog")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
        >
          <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "white", letterSpacing: "-1px" }}>
            amazon<span style={{ color: "var(--amz-amber)" }}>.com</span>
          </span>
        </div>

        {/* Deliver To Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", cursor: "pointer" }}>
          <MapPin size={18} color="white" />
          <div>
            <div style={{ color: "#ccc", fontSize: "0.72rem" }}>Deliver to Alex</div>
            <div style={{ fontWeight: 800 }}>San Francisco 94107</div>
          </div>
        </div>

        {/* Search Bar with Category Select */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", borderRadius: 6, overflow: "hidden", height: 40 }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              backgroundColor: "#f3f3f3",
              color: "#333",
              border: "none",
              padding: "0 10px",
              height: "100%",
              fontSize: "0.82rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              padding: "0 12px",
              fontSize: "0.95rem",
              outline: "none"
            }}
          />

          <button
            style={{
              backgroundColor: "var(--amz-amber)",
              border: "none",
              height: "100%",
              padding: "0 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Search size={22} color="#111" />
          </button>
        </div>

        {/* Account & Orders */}
        <div style={{ fontSize: "0.82rem", cursor: "pointer" }} onClick={() => setActiveView("orders")}>
          <div style={{ color: "#ccc", fontSize: "0.72rem" }}>Hello, Alex</div>
          <div style={{ fontWeight: 800 }}>Account & Lists</div>
        </div>

        <div style={{ fontSize: "0.82rem", cursor: "pointer" }} onClick={() => setActiveView("orders")}>
          <div style={{ color: "#ccc", fontSize: "0.72rem" }}>Returns</div>
          <div style={{ fontWeight: 800 }}>& Orders</div>
        </div>

        {/* Shopping Cart Button */}
        <div
          onClick={() => setActiveView("cart")}
          style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", position: "relative" }}
        >
          <div style={{ position: "relative" }}>
            <ShoppingCart size={32} color="white" />
            <span
              style={{
                position: "absolute",
                top: 2,
                left: 13,
                color: "var(--amz-amber)",
                fontWeight: 900,
                fontSize: "0.85rem"
              }}
            >
              {cartItemsCount}
            </span>
          </div>
          <span style={{ fontWeight: 800, fontSize: "0.9rem", marginTop: 8 }}>Cart</span>
        </div>
      </div>

      {/* Bottom Sub-Nav */}
      <div className="amz-header-bottom">
        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <Menu size={20} />
          <span>All</span>
        </div>
        <span style={{ cursor: "pointer" }}>Today's Deals</span>
        <span style={{ cursor: "pointer" }}>Customer Service</span>
        <span style={{ cursor: "pointer" }}>Registry</span>
        <span style={{ cursor: "pointer" }}>Gift Cards</span>
        <span style={{ cursor: "pointer" }}>Sell</span>
      </div>
    </header>
  );
};
