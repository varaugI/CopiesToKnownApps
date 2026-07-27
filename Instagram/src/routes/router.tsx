import type { RouteObject } from "react-router-dom";
import { AppShell } from "./AppShell";
import {
  AuthPhaseNotice,
  DirectRoute,
  EditProfileRoute,
  ExploreRoute,
  HomeRoute,
  NotFoundRoute,
  PostDetailRoute,
  ProfileRoute,
  ReelsRoute,
  RouteErrorPage,
  StoryRoute,
} from "./route-components";

export const photoFlowRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <AuthPhaseNotice mode="login" />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/register",
    element: <AuthPhaseNotice mode="register" />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: "explore", element: <ExploreRoute /> },
      { path: "reels", element: <ReelsRoute /> },
      { path: "direct", element: <DirectRoute /> },
      { path: "direct/:conversationId", element: <DirectRoute /> },
      { path: "accounts/edit", element: <EditProfileRoute /> },
      { path: "p/:postId", element: <PostDetailRoute /> },
      { path: "stories/:username/:storyId", element: <StoryRoute /> },
      { path: ":username", element: <ProfileRoute /> },
      { path: "*", element: <NotFoundRoute /> },
    ],
  },
];
