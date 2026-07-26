export const CURRENT_USER = {
  id: "user_gh_me",
  name: "Alex Rivera",
  username: "alex-rivera",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  bio: "⚡ Staff Software Engineer & AI Architect | Building Next-Gen Agentic Tools 🤖\n📍 San Francisco, CA | 🌐 alexrivera.design",
  company: "@GoogleDeepMind",
  location: "San Francisco, CA",
  website: "https://alexrivera.design",
  twitter: "alexrivera_dev",
  followersCount: 1420,
  followingCount: 284,
  starredCount: 89,
  contributionsLastYear: 1842
};

export const INITIAL_REPOS = [
  {
    id: "repo_1",
    name: "antigravity-framework",
    owner: {
      login: "alex-rivera",
      avatar: CURRENT_USER.avatar
    },
    description: "⚡ Advanced AI Agentic Coding Framework with subagent delegation, background task execution, and interactive UI artifacts.",
    isPrivate: false,
    starsCount: 3840,
    forksCount: 420,
    watchersCount: 182,
    isStarred: true,
    defaultBranch: "main",
    primaryLanguage: "TypeScript",
    languageColor: "#3178c6",
    updatedAt: "2 hours ago",
    latestCommit: {
      message: "feat: Overhaul subagent execution logs and add local storage persistence",
      author: "Alex Rivera",
      avatar: CURRENT_USER.avatar,
      hash: "a8f3b2c",
      timestamp: "2 hours ago"
    },
    files: [
      {
        path: "README.md",
        name: "README.md",
        type: "file",
        content: `# ⚡ Antigravity Agentic Framework

> Next-generation agentic AI coding framework built for high-autonomy pair programming.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#) [![License](https://img.shields.io/badge/license-MIT-blue)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](#)

## Features

- 🧠 **Autonomous Planning Mode**: Generates detailed implementation plans and walkthrough artifacts before execution.
- ⚡ **Background Task Execution**: Runs terminal commands and build servers in background tasks without blocking UI responsiveness.
- 🎨 **Modern Design Tokens**: Implements state-of-the-art dark modes, glassmorphism, and micro-animations.
- 📦 **LocalStorage Sync**: Automatic browser persistence across sessions.

## Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/alex-rivera/antigravity-framework.git

# Install dependencies
cd antigravity-framework
npm install

# Start development server
npm run dev
\`\`\`

## Architecture Diagram

\`\`\`text
  +------------------+         +--------------------+
  |  Planner Agent   |  -----> |  Execution Engine  |
  +------------------+         +--------------------+
           |                             |
           v                             v
  +------------------+         +--------------------+
  | Artifact Studio  |         | Background Worker  |
  +------------------+         +--------------------+
\`\`\`

## License
MIT © 2026 Alex Rivera
`
      },
      {
        path: "package.json",
        name: "package.json",
        type: "file",
        content: `{\n  "name": "antigravity-framework",\n  "version": "2.4.0",\n  "private": true,\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "lint": "eslint ."\n  },\n  "dependencies": {\n    "react": "^19.0.0",\n    "react-dom": "^19.0.0",\n    "lucide-react": "^0.450.0"\n  }\n}`
      },
      {
        path: "src/index.ts",
        name: "index.ts",
        type: "file",
        content: `import { AgentEngine } from "./agent/engine";\nimport { TaskRunner } from "./tasks/runner";\n\nexport const initializeAntigravity = () => {\n  console.log("⚡ Antigravity Agent Framework v2.4 initialized.");\n  return new AgentEngine();\n};`
      },
      {
        path: "src/agent/engine.ts",
        name: "engine.ts",
        type: "file",
        content: `export class AgentEngine {\n  private state: string = "IDLE";\n\n  public async executePlan(planId: string) {\n    this.state = "EXECUTING";\n    console.log(\`Executing plan: \${planId}\`);\n    return { success: true, timestamp: Date.now() };\n  }\n}`
      }
    ],
    issues: [
      {
        id: "i1",
        number: 42,
        title: "Add support for streaming terminal command logs in background tasks",
        author: { login: "sarah-dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
        status: "open",
        labels: [{ name: "enhancement", color: "#a2eeef" }, { name: "good first issue", color: "#7057ff" }],
        commentsCount: 5,
        createdAt: "3 days ago"
      },
      {
        id: "i2",
        number: 39,
        title: "Fix dark mode contrast ratio on secondary button borders",
        author: { login: "david-m", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
        status: "open",
        labels: [{ name: "bug", color: "#d73a4a" }],
        commentsCount: 2,
        createdAt: "5 days ago"
      }
    ],
    pullRequests: [
      {
        id: "pr1",
        number: 44,
        title: "feat: Add interactive voice note waveform renderer",
        author: { login: "elena-r", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
        status: "open",
        branch: "feature/voice-waveform",
        changes: "+142 -18",
        createdAt: "Yesterday"
      },
      {
        id: "pr2",
        number: 38,
        title: "fix: Optimize Vite build bundle chunk splitting",
        author: { login: "alex-rivera", avatar: CURRENT_USER.avatar },
        status: "merged",
        branch: "fix/vite-chunks",
        changes: "+34 -82",
        createdAt: "4 days ago"
      }
    ],
    actions: [
      {
        id: "a1",
        name: "CI / Build & Test Suite",
        status: "success",
        branch: "main",
        commit: "a8f3b2c",
        duration: "1m 14s",
        timestamp: "2 hours ago"
      },
      {
        id: "a2",
        name: "Deploy to Staging Environment",
        status: "success",
        branch: "main",
        commit: "a8f3b2c",
        duration: "45s",
        timestamp: "2 hours ago"
      }
    ]
  },
  {
    id: "repo_2",
    name: "react-design-tokens",
    owner: {
      login: "alex-rivera",
      avatar: CURRENT_USER.avatar
    },
    description: "🎨 Curated collection of CSS variables, glassmorphic utilities, and micro-animations for React applications.",
    isPrivate: false,
    starsCount: 1240,
    forksCount: 95,
    watchersCount: 42,
    isStarred: true,
    defaultBranch: "main",
    primaryLanguage: "CSS",
    languageColor: "#563d7c",
    updatedAt: "1 day ago",
    latestCommit: {
      message: "style: Add neon cyan and magenta gradient variables",
      author: "Alex Rivera",
      avatar: CURRENT_USER.avatar,
      hash: "7f4c1e9",
      timestamp: "1 day ago"
    },
    files: [
      {
        path: "README.md",
        name: "README.md",
        type: "file",
        content: `# 🎨 React Design Tokens\n\nPragmatic CSS variable design tokens for building premium dark-mode web applications.`
      }
    ],
    issues: [],
    pullRequests: [],
    actions: []
  },
  {
    id: "repo_3",
    name: "fastify-rest-starter",
    owner: {
      login: "alex-rivera",
      avatar: CURRENT_USER.avatar
    },
    description: "🚀 Production-ready Fastify REST API boilerplate with Prisma ORM, JWT authentication, and Swagger docs.",
    isPrivate: false,
    starsCount: 890,
    forksCount: 112,
    watchersCount: 30,
    isStarred: false,
    defaultBranch: "main",
    primaryLanguage: "JavaScript",
    languageColor: "#f1e05a",
    updatedAt: "3 days ago",
    latestCommit: {
      message: "chore: Upgrade Fastify v5 and update Prisma schema",
      author: "Alex Rivera",
      avatar: CURRENT_USER.avatar,
      hash: "c2b1a4f",
      timestamp: "3 days ago"
    },
    files: [],
    issues: [],
    pullRequests: [],
    actions: []
  }
];
