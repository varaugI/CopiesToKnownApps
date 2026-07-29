import React from "react";
import { MongoProvider, useMongo } from "./context/MongoContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { DocumentViewer } from "./components/documents/DocumentViewer";
import { EditDocumentModal } from "./components/documents/EditDocumentModal";
import { AggregationStudio } from "./components/aggregation/AggregationStudio";
import { MongoShell } from "./components/shell/MongoShell";
import { IndexManager } from "./components/indexes/IndexManager";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useMongo();

  return (
    <div className="mg-app">
      <Header />
      <Sidebar />

      <main className="mg-main-content">
        {activeView === "documents" && <DocumentViewer />}
        {activeView === "aggregation" && <AggregationStudio />}
        {activeView === "shell" && <MongoShell />}
        {activeView === "indexes" && <IndexManager />}
      </main>

      <EditDocumentModal />
    </div>
  );
};

export default function App() {
  return (
    <MongoProvider>
      <MainLayout />
    </MongoProvider>
  );
}
