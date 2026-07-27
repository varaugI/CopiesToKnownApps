# Phase 1 frontend foundation

- Status: Implemented
- Date: 2026-07-26
- Scope: Frontend architecture only
- Backend status: Not implemented

## Goals and evidence

| Goal | Implementation |
| --- | --- |
| Incremental TypeScript | Entry, router, types, contexts, API/query foundations, dialog/error boundaries, and profile form use strict TypeScript |
| React Router | One route table supports production browser routing and test memory routing |
| URL-based views | Feed, Explore, Reels, Direct, conversation, profile, edit, post, Story, login, and register URLs |
| Typed domain models | `src/types/domain.ts` defines profile, content, Story, Reel, chat, notification, and Explore contracts |
| Typed API boundary | `src/api/api-client.ts` implements generic requests, in-memory access token, abort support, credentialed requests, and centralized errors |
| Error Boundary | Top-level recoverable UI plus route-level error UI |
| Accessible dialog foundation | Dialog role, modal semantics, initial focus, Escape, Tab containment, backdrop close, and focus restoration |
| Split Context | Seven feature-scoped providers replace the 292-line all-purpose context |
| Server-state boundary | TanStack Query is configured with bounded retry defaults but unused until real endpoints exist |
| Form boundary | Profile editing uses React Hook Form, Zod, typed values, and image type/size checks |
| Route splitting | Primary route components load through `React.lazy` and Suspense |

## Router design

`App.tsx` creates a Browser Router in production and a Memory Router when tests provide initial entries. Both use `routes/router.tsx`, preventing test-only route drift.

`AppShell` owns persistent navigation and transient global drawers/modals. Its `Outlet` renders the active route. Post detail, profile edit, and Story routes render their existing background screen plus a route-aware modal/viewer.

Post and Story open actions save `backgroundPath` in navigation state. Closing returns to that path, while direct deep links fall back safely to `/` or the current profile.

Login and register routes are deliberately non-functional notices. Authentication remains Phase 3, and no frontend code pretends a session exists.

## State ownership

```text
App
|-- ErrorBoundary
|-- QueryClientProvider
`-- AppProviders
    |-- UiProvider
    |-- ProfileProvider
    |   `-- PostsProvider
    |-- StoriesProvider
    |-- ReelsProvider
    |-- MessagingProvider
    `-- NotificationsProvider
```

`PostsProvider` depends on `ProfileProvider` so locally created posts use the current profile and update its post count. Other providers do not consume each other. Router state replaces active view, active conversation, active post-detail, active Story, and edit-modal flags.

## Current user flows

### Post detail

1. A user activates a post/comment/Explore/profile item.
2. React Router navigates to `/p/:postId`.
3. `PostDetailRoute` lazy-loads the feed and detail component.
4. `PostsProvider.getPostById` resolves local or normalized Explore content.
5. The accessible dialog renders.
6. Likes/comments still update the mock posts provider and local storage.
7. Closing restores the saved background path.

There is no API request, authorization, PostgreSQL query, Redis access, job, event, or TanStack Query mutation yet.

### Story

1. A Story button navigates to `/stories/:username/:storyId`.
2. The viewer resolves the group/item from typed Story context.
3. Seen state updates locally.
4. Timer, next, and previous actions replace the Story URL while retaining background navigation state.
5. Closing restores the previous screen.

### Profile edit

1. `/accounts/edit` renders the profile and edit dialog.
2. React Hook Form owns input state.
3. Zod validates name, username, website, bio, and avatar value.
4. Image selection checks image MIME and a 5 MB bound before Base64 preview.
5. Valid data updates `ProfileProvider`, reconciles `insta_user`, and navigates to the edited username.

## Typed API boundary

The client accepts generic response/body types and constructs JSON requests consistently. Access tokens are held on the client instance only; refresh cookies are reserved for the Phase 3 backend and `credentials: "include"` is already explicit.

HTTP status mapping distinguishes bad input, unauthenticated, forbidden, missing, conflict, rate-limited, server, network, and invalid-response failures. Abort errors remain abort errors so callers can cancel stale requests without showing false failures.

No component calls the client in Phase 1. This prevents fake backend success or accidental mock fallback.

## Failure behavior

- Unexpected render errors show a recoverable top-level state without displaying the thrown message.
- Router loader/render errors use a safe route error page.
- Lazy routes show a status fallback.
- Invalid mock profiles show an explicit unavailable state.
- Storage parse/write helpers degrade to the mock fallback instead of crashing.
- API errors are typed for future centralized UI mapping.

## Test coverage

- preserved Story opening/navigation/closing
- post-like persistence
- comment persistence
- local direct-message persistence
- primary-view reachability
- direct route deep links
- post-detail deep link/close
- login/register honesty
- browser Back/Forward route restoration
- dialog Escape/focus restoration
- profile validation and valid persistence
- API in-memory token and rate-limit mapping
- Error Boundary privacy behavior

## Deferred work

Authentication, protected routes, real TanStack Query hooks, upload sessions, server data, realtime events, and database persistence depend on later backend phases. The current routes are not authorization boundaries.
