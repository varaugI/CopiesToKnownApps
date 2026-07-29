import React, { createContext, useContext, useState, useEffect } from "react";
import { CURRENT_USER, INITIAL_PROBLEMS } from "../data/mockLeetCodeData";

const LeetCodeContext = createContext();

export const LeetCodeProvider = ({ children }) => {
  const [activeView, setActiveView] = useState("problemset");
  const [user, setUser] = useState(CURRENT_USER);

  const [problems, setProblems] = useState(() => {
    const saved = localStorage.getItem("lc_problems");
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  useEffect(() => {
    localStorage.setItem("lc_problems", JSON.stringify(problems));
  }, [problems]);

  const [activeProblemId, setActiveProblemId] = useState(1);
  const activeProblem = problems.find((p) => p.id === activeProblemId) || problems[0];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(activeProblem.starterCode.javascript);
  const [submissionResult, setSubmissionResult] = useState(null);

  const openWorkspace = (problemId) => {
    setActiveProblemId(problemId);
    const target = problems.find((p) => p.id === problemId);
    if (target) {
      setUserCode(target.starterCode[selectedLanguage] || target.starterCode.javascript);
    }
    setSubmissionResult(null);
    setActiveView("workspace");
  };

  const runCode = () => {
    setSubmissionResult({
      status: "Executing...",
      loading: true
    });

    setTimeout(() => {
      setSubmissionResult({
        status: "Accepted",
        runtime: `${Math.floor(Math.random() * 30 + 40)} ms`,
        memory: `${(Math.random() * 5 + 40).toFixed(1)} MB`,
        beats: `${(Math.random() * 20 + 75).toFixed(1)}%`,
        output: activeProblem.examples[0]?.output || "Test passed"
      });
    }, 1000);
  };

  const submitSolution = () => {
    runCode();
    setProblems((prev) =>
      prev.map((p) => (p.id === activeProblemId ? { ...p, status: "Solved" } : p))
    );
  };

  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <LeetCodeContext.Provider
      value={{
        activeView,
        setActiveView,
        user,
        problems,
        activeProblem,
        openWorkspace,
        selectedLanguage,
        setSelectedLanguage,
        userCode,
        setUserCode,
        submissionResult,
        runCode,
        submitSolution,
        difficultyFilter,
        setDifficultyFilter,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </LeetCodeContext.Provider>
  );
};

export const useLeetCode = () => useContext(LeetCodeContext);
