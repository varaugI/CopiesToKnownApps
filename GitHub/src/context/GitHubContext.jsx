import React, { createContext, useContext, useState, useEffect } from "react";
import { CURRENT_USER, INITIAL_REPOS } from "../data/mockGitHubData";

const GitHubContext = createContext();

export const GitHubProvider = ({ children }) => {
  // Navigation View ('dashboard', 'repo', 'profile', 'newrepo')
  const [activeView, setActiveView] = useState("dashboard");

  // User Profile
  const [user, setUser] = useState(CURRENT_USER);

  // Repositories State
  const [repos, setRepos] = useState(() => {
    const saved = localStorage.getItem("gh_repos");
    return saved ? JSON.parse(saved) : INITIAL_REPOS;
  });

  useEffect(() => {
    localStorage.setItem("gh_repos", JSON.stringify(repos));
  }, [repos]);

  // Active Selected Repo
  const [activeRepoId, setActiveRepoId] = useState("repo_1");
  const [activeRepoTab, setActiveRepoTab] = useState("code"); // 'code' | 'issues' | 'pulls' | 'actions' | 'settings'
  const [activeFilePath, setActiveFilePath] = useState(null);

  const activeRepo = repos.find((r) => r.id === activeRepoId) || repos[0];

  const openRepo = (repoId, tab = "code") => {
    setActiveRepoId(repoId);
    setActiveRepoTab(tab);
    setActiveFilePath(null);
    setActiveView("repo");
  };

  const toggleStarRepo = (repoId) => {
    setRepos((prev) =>
      prev.map((r) => {
        if (r.id === repoId) {
          const isStarred = !r.isStarred;
          return {
            ...r,
            isStarred,
            starsCount: isStarred ? r.starsCount + 1 : r.starsCount - 1
          };
        }
        return r;
      })
    );
  };

  const createRepository = ({ name, description, isPrivate, addReadme }) => {
    const newRepo = {
      id: "repo_" + Date.now(),
      name,
      owner: {
        login: user.username,
        avatar: user.avatar
      },
      description,
      isPrivate: Boolean(isPrivate),
      starsCount: 1,
      forksCount: 0,
      watchersCount: 1,
      isStarred: true,
      defaultBranch: "main",
      primaryLanguage: "TypeScript",
      languageColor: "#3178c6",
      updatedAt: "JUST NOW",
      latestCommit: {
        message: "Initial commit",
        author: user.name,
        avatar: user.avatar,
        hash: "1a2b3c4",
        timestamp: "JUST NOW"
      },
      files: addReadme
        ? [
            {
              path: "README.md",
              name: "README.md",
              type: "file",
              content: `# ${name}\n\n${description || "Initial repository setup."}`
            }
          ]
        : [],
      issues: [],
      pullRequests: [],
      actions: []
    };

    setRepos((prev) => [newRepo, ...prev]);
    openRepo(newRepo.id, "code");
  };

  const createIssue = (repoId, { title, labelName }) => {
    const newIssue = {
      id: "i_" + Date.now(),
      number: Math.floor(Math.random() * 50 + 10),
      title,
      author: { login: user.username, avatar: user.avatar },
      status: "open",
      labels: [{ name: labelName || "enhancement", color: "#a2eeef" }],
      commentsCount: 0,
      createdAt: "Just now"
    };

    setRepos((prev) =>
      prev.map((r) => {
        if (r.id === repoId) {
          return { ...r, issues: [newIssue, ...r.issues] };
        }
        return r;
      })
    );
  };

  // Search Query
  const [searchQuery, setSearchQuery] = useState("");

  // New Issue Modal
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);

  return (
    <GitHubContext.Provider
      value={{
        activeView,
        setActiveView,
        user,
        setUser,
        repos,
        activeRepo,
        openRepo,
        activeRepoTab,
        setActiveRepoTab,
        activeFilePath,
        setActiveFilePath,
        toggleStarRepo,
        createRepository,
        createIssue,
        searchQuery,
        setSearchQuery,
        isNewIssueModalOpen,
        setIsNewIssueModalOpen
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => useContext(GitHubContext);
