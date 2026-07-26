import React from "react";
import { GitHubProvider, useGitHub } from "./context/GitHubContext";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/layout/Dashboard";
import { RepoView } from "./components/repo/RepoView";
import { ProfileView } from "./components/profile/ProfileView";
import { NewRepoView } from "./components/create/NewRepoView";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useGitHub();

  return (
    <div className="gh-app-container">
      <Header />

      <main className="gh-main-container">
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "repo" && <RepoView />}
        {activeView === "profile" && <ProfileView />}
        {activeView === "newrepo" && <NewRepoView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <GitHubProvider>
      <MainLayout />
    </GitHubProvider>
  );
}
