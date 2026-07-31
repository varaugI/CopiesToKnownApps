import React, { createContext, useContext, useState, useEffect } from "react";
import { CATEGORIES, INITIAL_PRODUCTS } from "../data/mockAmazonData";

const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  const [activeView, setActiveView] = useState("catalog");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeProduct, setActiveProduct] = useState(INITIAL_PRODUCTS[0]);

  // Shopping Cart with LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("amz_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("amz_cart", JSON.stringify(cart));
  }, [cart]);

  // Orders History
  const [orders, setOrders] = useState([]);

  const openProductDetail = (product) => {
    setActiveProduct(product);
    setActiveView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: "ord_" + Date.now(),
      date: new Date().toLocaleDateString(),
      total: cartTotal,
      items: cart
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveView("orders");
  };

  return (
    <AmazonContext.Provider
      value={{
        activeView,
        setActiveView,
        products,
        categories: CATEGORIES,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeProduct,
        openProductDetail,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartItemsCount,
        orders,
        placeOrder
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};

export const useAmazon = () => useContext(AmazonContext);
