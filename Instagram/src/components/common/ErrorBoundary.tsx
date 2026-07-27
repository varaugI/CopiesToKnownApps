import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("PhotoFlow render failure", {
        name: error.name,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  private reset = (): void => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="route-state-page" role="alert">
          <h1>PhotoFlow hit an unexpected problem</h1>
          <p>Your browser data was not cleared. Try rendering this screen again.</p>
          <button type="button" className="btn-primary" onClick={this.reset}>
            Try again
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
