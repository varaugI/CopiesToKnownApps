import React from "react";
import { Package, CheckCircle } from "lucide-react";
import { useAmazon } from "../context/AmazonContext";

export const OrdersView = () => {
  const { orders } = useAmazon();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24, width: "100%" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20 }}>Your Orders</h1>

      {orders.length === 0 ? (
        <div style={{ backgroundColor: "white", padding: 40, borderRadius: 8, textAlign: "center", border: "1px solid var(--amz-border)" }}>
          You have no placed orders yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                border: "1px solid var(--amz-border)",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  backgroundColor: "#f0f2f2",
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)"
                }}
              >
                <div>
                  ORDER PLACED: <strong style={{ color: "#111" }}>{order.date}</strong>
                </div>
                <div>
                  TOTAL: <strong style={{ color: "#111" }}>${order.total.toFixed(2)}</strong>
                </div>
                <div>
                  ORDER # <strong style={{ color: "#111" }}>{order.id}</strong>
                </div>
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#007600", fontWeight: 800 }}>
                  <CheckCircle size={20} />
                  <span>Arriving Tomorrow by 10 PM</span>
                </div>

                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.product.title}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        Qty: {item.quantity} • ${item.product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
