import React from "react";
import { LeetCodeProvider, useLeetCode } from "./context/LeetCodeContext";
import { Header } from "./components/Header";
import { ProblemList } from "./components/ProblemList";
import { Workspace } from "./components/Workspace";
import { Profile } from "./components/Profile";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useLeetCode();

  return (
    <div className="lc-app">
      <Header />
      <main className="lc-main">
        {activeView === "problemset" && <ProblemList />}
        {activeView === "workspace" && <Workspace />}
        {activeView === "profile" && <Profile />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <LeetCodeProvider>
      <MainLayout />
    </LeetCodeProvider>
  );
}
