import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: 32,
            backgroundColor: "var(--wa-dark-body, #111b21)",
            color: "white",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #8696a0)", maxWidth: 480, marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected UI error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "var(--wa-emerald, #00a884)",
              color: "#111b21",
              border: "none",
              borderRadius: 20,
              padding: "10px 24px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
