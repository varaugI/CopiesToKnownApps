import React from "react";
import { RepoHeader } from "./RepoHeader";
import { FileExplorer } from "./FileExplorer";
import { CodeViewer } from "./CodeViewer";
import { ReadmeRenderer } from "./ReadmeRenderer";
import { IssuesView } from "../issues/IssuesView";
import { PullRequestsView } from "../pulls/PullRequestsView";
import { ActionsView } from "../actions/ActionsView";
import { useGitHub } from "../../context/GitHubContext";

export const RepoView = () => {
  const { activeRepo, activeRepoTab, activeFilePath } = useGitHub();

  if (!activeRepo) return null;

  const currentFile = activeRepo.files.find((f) => f.path === activeFilePath);
  const readmeFile = activeRepo.files.find((f) => f.path === "README.md");

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <RepoHeader repo={activeRepo} />

      <main className="gh-content-wrapper">
        {activeRepoTab === "code" && (
          <>
            {activeFilePath && currentFile ? (
              <CodeViewer file={currentFile} />
            ) : (
              <>
                <FileExplorer repo={activeRepo} />
                {readmeFile && <ReadmeRenderer content={readmeFile.content} />}
              </>
            )}
          </>
        )}

        {activeRepoTab === "issues" && <IssuesView repo={activeRepo} />}
        {activeRepoTab === "pulls" && <PullRequestsView repo={activeRepo} />}
        {activeRepoTab === "actions" && <ActionsView repo={activeRepo} />}
      </main>
    </div>
  );
};
