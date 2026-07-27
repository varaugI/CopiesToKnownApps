import { lazy, Suspense, type ReactNode } from "react";
import {
  Link,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "react-router-dom";

const Feed = lazy(() => import("../components/feed/Feed").then((module) => ({ default: module.Feed })));
const Explore = lazy(() =>
  import("../components/explore/Explore").then((module) => ({ default: module.Explore })),
);
const Reels = lazy(() =>
  import("../components/reels/Reels").then((module) => ({ default: module.Reels })),
);
const DirectMessages = lazy(() =>
  import("../components/messages/DirectMessages").then((module) => ({
    default: module.DirectMessages,
  })),
);
const Profile = lazy(() =>
  import("../components/profile/Profile").then((module) => ({ default: module.Profile })),
);
const EditProfileModal = lazy(() =>
  import("../components/profile/EditProfileModal").then((module) => ({
    default: module.EditProfileModal,
  })),
);
const PostDetailModal = lazy(() =>
  import("../components/explore/PostDetailModal").then((module) => ({
    default: module.PostDetailModal,
  })),
);
const StoryViewer = lazy(() =>
  import("../components/stories/StoryViewer").then((module) => ({
    default: module.StoryViewer,
  })),
);

function RouteSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="route-state-page" role="status">
          Loading PhotoFlow…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export function HomeRoute() {
  return (
    <RouteSuspense>
      <Feed />
    </RouteSuspense>
  );
}

export function ExploreRoute() {
  return (
    <RouteSuspense>
      <Explore />
    </RouteSuspense>
  );
}

export function ReelsRoute() {
  return (
    <RouteSuspense>
      <Reels />
    </RouteSuspense>
  );
}

export function DirectRoute() {
  return (
    <RouteSuspense>
      <DirectMessages />
    </RouteSuspense>
  );
}

export function ProfileRoute() {
  return (
    <RouteSuspense>
      <Profile />
    </RouteSuspense>
  );
}

export function EditProfileRoute() {
  return (
    <RouteSuspense>
      <Profile />
      <EditProfileModal />
    </RouteSuspense>
  );
}

export function PostDetailRoute() {
  const location = useLocation();
  const state = location.state;
  const backgroundPath =
    state && typeof state === "object" && "backgroundPath" in state
      ? state.backgroundPath
      : "/";
  const background =
    backgroundPath === "/explore" ? <Explore /> : backgroundPath !== "/" ? <Profile /> : <Feed />;

  return (
    <RouteSuspense>
      {background}
      <PostDetailModal />
    </RouteSuspense>
  );
}

export function StoryRoute() {
  return (
    <RouteSuspense>
      <Feed />
      <StoryViewer />
    </RouteSuspense>
  );
}

export function AuthPhaseNotice({ mode }: { mode: "login" | "register" }) {
  return (
    <main className="route-state-page">
      <h1>{mode === "login" ? "Log in to PhotoFlow" : "Create a PhotoFlow account"}</h1>
      <p>Authentication is intentionally introduced in Phase 3. This route is reserved now so links are stable.</p>
      <Link to="/">Return to the mock frontend</Link>
    </main>
  );
}

export function NotFoundRoute() {
  return (
    <section className="route-state-page">
      <h1>Page not found</h1>
      <p>The requested PhotoFlow page is unavailable in the current mock dataset.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "The requested route could not be rendered.";

  return (
    <main className="route-state-page" role="alert">
      <h1>PhotoFlow could not open this page</h1>
      <p>{message}</p>
      <Link to="/">Return home</Link>
    </main>
  );
}
