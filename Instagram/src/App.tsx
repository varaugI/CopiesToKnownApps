import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  type RouterProviderProps,
} from "react-router-dom";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { AppProviders } from "./context/AppProviders";
import { createPhotoFlowQueryClient } from "./query/query-client";
import { photoFlowRoutes } from "./routes/router";
import "./index.css";

interface AppProps {
  initialEntries?: string[];
}

function createRouter(initialEntries?: string[]): RouterProviderProps["router"] {
  return initialEntries
    ? createMemoryRouter(photoFlowRoutes, { initialEntries })
    : createBrowserRouter(photoFlowRoutes);
}

export default function App({ initialEntries }: AppProps) {
  const [queryClient] = useState(createPhotoFlowQueryClient);
  const [router] = useState(() => createRouter(initialEntries));

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
