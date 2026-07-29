import React from "react";
import { AmazonProvider, useAmazon } from "./context/AmazonContext";
import { Header } from "./components/Header";
import { ProductCatalog } from "./components/ProductCatalog";
import { ProductDetail } from "./components/ProductDetail";
import { CartView } from "./components/CartView";
import { OrdersView } from "./components/OrdersView";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useAmazon();

  return (
    <div className="amz-app">
      <Header />
      <main style={{ flex: 1 }}>
        {activeView === "catalog" && <ProductCatalog />}
        {activeView === "detail" && <ProductDetail />}
        {activeView === "cart" && <CartView />}
        {activeView === "orders" && <OrdersView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AmazonProvider>
      <MainLayout />
    </AmazonProvider>
  );
}
