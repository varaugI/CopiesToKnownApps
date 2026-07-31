import React from "react";
import { Trash2, CheckCircle2 } from "lucide-react";
import { useAmazon } from "../context/AmazonContext";

export const CartView = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder, setActiveView } = useAmazon();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24, width: "100%", display: "flex", gap: 32 }}>
      {/* Left Column: Cart Items List */}
      <div style={{ flex: 1, backgroundColor: "white", borderRadius: 8, padding: 24, border: "1px solid var(--amz-border)" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>Shopping Cart</h1>
        <hr style={{ borderColor: "var(--amz-border)", marginBottom: 20 }} />

        {cart.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            Your Amazon Cart is empty.
            <div style={{ marginTop: 16 }}>
              <button className="btn-amz-yellow" onClick={() => setActiveView("catalog")}>
                Shop today's deals
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {cart.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: "flex",
                  gap: 20,
                  borderBottom: "1px solid var(--amz-border)",
                  paddingBottom: 20
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  style={{ width: 120, height: 120, objectFit: "contain" }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
                    {item.product.title}
                  </h3>

                  <div style={{ color: "#007600", fontSize: "0.85rem", fontWeight: 700, marginBottom: 8 }}>
                    In Stock
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                      style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--amz-border)" }}
                    >
                      {[1, 2, 3, 4, 5].map((q) => (
                        <option key={q} value={q}>Qty: {q}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007185",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Subtotal Box */}
      {cart.length > 0 && (
        <div
          style={{
            width: 300,
            backgroundColor: "white",
            border: "1px solid var(--amz-border)",
            borderRadius: 8,
            padding: 20,
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#007600", fontSize: "0.85rem" }}>
            <CheckCircle2 size={18} />
            <span>Your order qualifies for FREE Shipping</span>
          </div>

          <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
            Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items): ${cartTotal.toFixed(2)}
          </div>

          <button className="btn-amz-yellow" onClick={placeOrder} style={{ width: "100%" }}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};
