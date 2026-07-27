# Phase 0 repository audit

- Audit date: 2026-07-26
- Scope: `CopiesToKnownApps/Instagram` only
- Baseline: repository state before Phase 0 edits
- Generated folders excluded from the tree: `node_modules/`, `dist/`, `coverage/`

Line references in the issue-verification table describe the audited baseline. The StoryViewer defect and baseline-tooling findings also state their Phase 0 resolution.

## Relevant baseline tree

```text
Instagram/
|-- .gitignore
|-- .oxlintrc.json
|-- README.md
|-- index.html
|-- package-lock.json
|-- package.json
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- App.css
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|   |-- assets/
|   |   |-- hero.png
|   |   |-- react.svg
|   |   `-- vite.svg
|   |-- components/
|   |   |-- common/InstagramLogo.jsx
|   |   |-- create/CreatePostModal.jsx
|   |   |-- explore/
|   |   |   |-- Explore.jsx
|   |   |   `-- PostDetailModal.jsx
|   |   |-- feed/
|   |   |   |-- Feed.jsx
|   |   |   |-- LikesModal.jsx
|   |   |   |-- PostCard.jsx
|   |   |   `-- ShareModal.jsx
|   |   |-- layout/
|   |   |   |-- BottomNav.jsx
|   |   |   |-- Header.jsx
|   |   |   `-- Sidebar.jsx
|   |   |-- messages/DirectMessages.jsx
|   |   |-- notifications/NotificationsDrawer.jsx
|   |   |-- profile/
|   |   |   |-- EditProfileModal.jsx
|   |   |   `-- Profile.jsx
|   |   |-- reels/Reels.jsx
|   |   |-- search/SearchDrawer.jsx
|   |   `-- stories/
|   |       |-- StoriesBar.jsx
|   |       `-- StoryViewer.jsx
|   |-- context/AppContext.jsx
|   `-- data/mockData.js
`-- vite.config.js
```

No `backend/`, database schema/migration, Docker, CI, test, metrics, queue, cache, object-storage, or realtime implementation existed in the baseline.

## Component architecture

`src/main.jsx:1-10` mounts one `App`. `src/App.jsx:20-55` wraps the entire application in `AppProvider`, renders fixed layout/navigation, chooses one of five primary views from `activeView`, and always mounts the global drawers/modals.

The components divide visually by feature, but server-like behavior does not follow those folders. Components call `useApp()` directly, and `src/context/AppContext.jsx:14-289` owns nearly every shared read/write path:

- theme and theme persistence (`15-27`)
- navigation (`29-30`)
- current profile and persistence (`32-44`)
- posts, likes, saves, comments, creation, and persistence (`46-151`)
- Stories and active viewer (`153-163`)
- Reels and reactions (`165-190`)
- chats, active conversation, local message sends, and persistence (`192-221`)
- notifications and unread state (`223-229`)
- seven modal/drawer states (`231-238`)
- one provider value exposing all of the above (`240-285`)

Local component state additionally owns carousel position, comment inputs, create-post steps, profile tabs/forms, Story playback/reply/reaction state, Reel playback/mute state, inbox tabs, message input, and search input.

## Current data and persistence flows

### General read path

```text
src/data/mockData.js
  -> AppProvider useState initializers
  -> useApp()
  -> visual component
```

There is no `fetch`, HTTP client, WebSocket, Socket.IO client, or API contract in `src/`.

### Browser persistence

| Key | Written by | Contents | Durability/risk |
| --- | --- | --- | --- |
| `insta_theme` | `AppContext.jsx:20-23` | theme string | Device/browser only |
| `insta_user` | `AppContext.jsx:38-43` | full mock profile, including Base64 avatar if selected | Device/browser only; user-editable |
| `insta_posts` | `AppContext.jsx:52-54` | all posts/comments/reactions and possibly Base64 post media | Quota and data-loss risk |
| `insta_chats` | `AppContext.jsx:199-201` | all mock and locally sent message bodies | Device/browser only; no delivery |

Stories, Reel reactions, notification changes, active view, open modals, and most transient state are not persisted. JSON parse and storage write failures are not handled.

### Feed

`Feed.jsx:36-40` maps every local post with no pagination, ranking, privacy, blocking, muting, deduplication, or seen filtering. `PostCard` mutates the context for likes, saves, comments, and comment likes. Suggestions are hard-coded in `Feed.jsx:9-28`, and their Follow buttons do not mutate state (`Feed.jsx:92-119`).

### Media

Create-post and avatar inputs accept images through the HTML `accept` hint. `CreatePostModal.jsx:29-38` and `EditProfileModal.jsx:22-30` use `FileReader.readAsDataURL`, with no byte-size, decoded-type, dimensions, or content validation. The resulting Base64 can be written into `insta_posts` or `insta_user`. Preset, post, Story, avatar, Explore, and Reel media otherwise use third-party HTTPS URLs.

There is no upload session, object store, signed URL, metadata inspection, virus/scanning interface, rendition generation, worker, queue, FFmpeg, or cleanup.

### Stories

Story groups are static in `mockData.js:20-123`. `StoriesBar.jsx:39-56` opens a group. The baseline `StoryViewer.jsx:12-18` marked a group seen locally; a five-second timer advanced items/groups; heart reaction existed only in component state; sending a reply only cleared the input (`251-264` in the baseline). Nothing was sent or persisted. Expiry was not modeled.

The baseline returned early at `StoryViewer.jsx:20` before a second `useEffect` at `25-31`, violating Rules of Hooks. Phase 0 moved the return below all hooks, stabilized story advancement, and added a regression test.

### Reels

Reel data is static (`mockData.js:256-305`) and points to external Mixkit videos (`264`, `280`, `296`). `Reels.jsx:22-38` renders every Reel card. Each card uses `autoPlay` at `68-77`; no Intersection Observer or active-item policy pauses offscreen items. Like/save mutate only context memory. Share opens a local modal. Follow, comment, and report/more controls have no handler.

### Messaging

Conversations are static (`mockData.js:307-357`) and all display in every tab. `DirectMessages.jsx:17-18` changes only local tab styling; `76-134` never filters by it. Sending calls `AppContext.sendChatMessage`, creates a `Date.now()` ID, appends a body locally, and persists all chats. There is no membership authorization, server ordering, idempotency key, sent/delivered/read/failure state, retry, offline delivery, presence protocol, or realtime transport.

### Explore, search, and notifications

Explore merges local posts with mock Explore tiles. For a mock tile, `Explore.jsx:34-48` fabricates a creator, caption, and post-detail object in the browser.

Search derives candidates only from `chats.map(c => c.user)` and filters synchronously on every keystroke (`SearchDrawer.jsx:11-16`). It has no server scope, debounce, pagination, stale-request cancellation, privacy filter, or real history behavior.

Notifications come from `mockData.js:359-395`. Closing the drawer marks all local records read. Follow controls display state but have no click handler (`NotificationsDrawer.jsx:72-86`) and none of the notification state is persisted.

## Verification of the 45 reported issues

| # | Classification | Evidence |
| ---: | --- | --- |
| 1 | `CONFIRMED` | Baseline tree contains only Vite/React files; no `backend/` or server package. |
| 2 | `CONFIRMED` | Baseline `README.md:1-17` is the default “React + Vite” template. Replaced in Phase 0. |
| 3 | `CONFIRMED` | `src/context/AppContext.jsx:14-289` owns navigation, user, posts, Stories, Reels, messages, notifications, persistence, and modal state. |
| 4 | `CONFIRMED` | `AppContext.jsx:33-43` reads/writes `insta_user`. |
| 5 | `CONFIRMED` | `AppContext.jsx:47-54` reads/writes `insta_posts`. |
| 6 | `CONFIRMED` | `AppContext.jsx:193-201` reads/writes `insta_chats`. |
| 7 | `CONFIRMED` | `AppContext.jsx:56-81` toggles post like/save in local state; Reel variants are `168-190`. |
| 8 | `CONFIRMED` | `AppContext.jsx:83-127` creates/likes comments only in local post state. |
| 9 | `CONFIRMED` | `AppContext.jsx:129-151` prepends a locally constructed post. |
| 10 | `CONFIRMED` | `AppContext.jsx:38-44` merges profile fields and writes browser storage. |
| 11 | `CONFIRMED` | Comment, post, and message IDs use `Date.now()` at `AppContext.jsx:86`, `131`, and `206`; `PostCard.jsx:31` also uses it for double-tap timing. |
| 12 | `CONFIRMED` | `CreatePostModal.jsx:29-38` and `EditProfileModal.jsx:22-30` call `FileReader.readAsDataURL`. |
| 13 | `CONFIRMED` | Base64 post/avatar values flow into `insta_posts`/`insta_user` through `AppContext.jsx:41` and `52-54`. |
| 14 | `CONFIRMED` | Upload handlers accept any selected file without programmatic type/size checks; only `accept="image/*"` exists at `CreatePostModal.jsx:154` and `EditProfileModal.jsx:91`. |
| 15 | `CONFIRMED` | UI says “Drag photos and videos here” at `CreatePostModal.jsx:140`, while the input at `154` accepts only images and rendering uses `<img>`. |
| 16 | `CONFIRMED` | Stories originate only from `mockData.js:20-123` and initialize context at `AppContext.jsx:154`. |
| 17 | `CONFIRMED` | Baseline `StoryViewer.jsx:257-264` cleared reply text without sending/storing it. |
| 18 | `CONFIRMED` | Baseline `StoryViewer.jsx:10,16,252-255` kept reaction state in that component only. |
| 19 | `CONFIRMED` | `mockData.js:264,280,296` contains external video URLs used by `Reels.jsx:68-75`. |
| 20 | `CONFIRMED` | `Reels.jsx:22-38` renders all cards and each video has `autoPlay` at `68-75`. |
| 21 | `CONFIRMED` | No Intersection Observer/viewport playback code exists; `Reels.jsx:52-63` changes playback only when the video is clicked. |
| 22 | `CONFIRMED` | Reel Follow has no handler (`Reels.jsx:112-125`); comment button has no handler (`139-147`). |
| 23 | `CONFIRMED` | Messaging calls local `sendChatMessage`; no socket/client/API code exists. |
| 24 | `CONFIRMED` | Message objects in `mockData.js:307-357` and `AppContext.jsx:203-211` lack sent/delivered/read/failure fields. |
| 25 | `CONFIRMED` | `DirectMessages.jsx:17,52-73` changes a styling tab; `76-134` always maps all chats. |
| 26 | `CONFIRMED` | `SearchDrawer.jsx:11-16` searches only users derived from existing chats. |
| 27 | `CONFIRMED` | `SearchDrawer.jsx:7,12-16,57-61` filters on each change and has no request, debounce, cursor, or cancellation. |
| 28 | `CONFIRMED` | Mock source is `mockData.js:397-407`; `Explore.jsx:34-48` fabricates missing post details. |
| 29 | `CONFIRMED` | Notifications initialize from `mockData.js:359-395` through `AppContext.jsx:224`. |
| 30 | `CONFIRMED` | Follow button at `NotificationsDrawer.jsx:72-86` has no `onClick`; notification state also lacks persistence. |
| 31 | `CONFIRMED` | `AppContext.jsx:30` defines `activeView`; `App.jsx:21,29-33` switches views from it. |
| 32 | `CONFIRMED` | No router or URL-to-view mapping exists, so post/profile/message deep links are unavailable. |
| 33 | `CONFIRMED` | View changes do not write History; browser Back/Forward cannot reliably traverse in-app views. |
| 34 | `CONFIRMED` | No login/register/session code or identity dependency exists. |
| 35 | `CONFIRMED` | No authenticated actor or authorization policy exists; all local actions are callable. |
| 36 | `CONFIRMED` | Follower numbers and suggestions are mock values; no follows/follow requests/blocks persistence exists. |
| 37 | `CONFIRMED` | No backend exists, so no backend moderation exists. |
| 38 | `CONFIRMED` | Baseline `package.json:6-11` had no test script and no test files. Phase 0 adds five tests. |
| 39 | `CONFIRMED` | No workflow exists under the scoped application. |
| 40 | `CONFIRMED` | No Dockerfile or Compose file exists. |
| 41 | `CONFIRMED` | No logs, metrics, traces, health endpoints, or dashboards exist. |
| 42 | `CONFIRMED` | Baseline `StoryViewer.jsx:20` returned before `useEffect` at `25-31`; baseline lint reported `react-hooks/rules-of-hooks`. Fixed and tested in Phase 0. |
| 43 | `PARTIALLY_CONFIRMED` | `node_modules/` and `dist/` existed on disk, but `git ls-files -- Instagram/node_modules/** Instagram/dist/**` returned no tracked files. |
| 44 | `PARTIALLY_CONFIRMED` | The on-disk install is platform-specific as expected, but native files are ignored/untracked and the lockfile records optional platform packages. No committed native binary or demonstrated cross-platform build blocker was found. |
| 45 | `CONFIRMED` | No `.env*` file or environment documentation existed in the baseline. Phase 0 adds `.env.example` and README guidance. |

## Confirmed defects and risks

### Correctness and data-loss

- The conditional StoryViewer hook was a runtime hook-order defect and lint failure.
- `Date.now()` IDs can collide during same-millisecond operations.
- Context initializes with unchecked `JSON.parse`; malformed storage can prevent rendering.
- Storage writes have no quota/error handling. Base64 media makes quota exhaustion likely.
- Create-post increments the in-memory profile count but does not persist that user update.
- Modal detail objects can become stale after the underlying context post changes.
- Story seen/reaction state, Reel reactions, and notification reads disappear on reload.
- All user-created data is lost when site data is cleared or when a different browser/device is used.

### Accessibility

- Many navigation and list actions are click-only `<div>` elements (`Sidebar.jsx`, `BottomNav.jsx`, `StoriesBar.jsx`, `Explore.jsx`, `DirectMessages.jsx`, `SearchDrawer.jsx`) without keyboard semantics.
- Most modals/drawers lack dialog semantics, focus trapping, focus restoration, Escape handling, and background inertness.
- Numerous icon-only buttons lack accessible names.
- Several visible labels are not programmatically associated with form controls.
- Generic media alt text such as “Post media”, “Explore item”, and “Story” does not communicate content.
- Auto-advancing Story content lacks a complete reduced-motion/announcement policy.
- Phase 0 improves StoryViewer/post-control names but does not claim a full accessibility repair.

### Performance

- Any provider state change can rerender consumers because one large value object owns unrelated domains.
- Every feed post and image renders eagerly; there is no cursor pagination, lazy loading, or virtualization.
- Every Reel video is mounted with autoplay and no viewport gating.
- Synchronous Base64 conversion and whole-collection JSON serialization can block the main thread.
- Search scans the complete local chat-user list on every keystroke.
- Third-party media has no application-controlled rendition, dimensions policy, cache policy, or failure strategy.

### Security and privacy

- There is no authentication, authorization, privacy graph, server validation, rate limit, audit trail, or moderation enforcement.
- `localStorage` data is user-modifiable and accessible to any successful same-origin script injection.
- Message bodies and profile/content state are stored in plaintext browser storage.
- File input `accept` is not a security boundary; content and size are unvalidated.
- External media hosts learn client requests and are outside PhotoFlow access control.
- No CSP, signed URLs, private-media delivery, secure sessions, or secret/config validation exists.
- The UI must not be represented as enforcing private accounts, blocks, or verified status.

## Missing tests and infrastructure in the baseline

Missing tests included component, state/domain, upload, accessibility, route, API, integration, E2E, concurrency, security, media-worker, realtime, and load tests.

Missing infrastructure included backend runtime, PostgreSQL/Prisma, Redis, BullMQ, MinIO, FFmpeg worker, migrations, seed data, Dockerfiles/Compose, CI, health checks, metrics/traces/logging, Prometheus/Grafana, Testcontainers, Playwright, and k6.

Phase 0 intentionally adds only frontend unit/integration tests and frontend quality commands. Later-phase infrastructure remains absent and is documented honestly.

## Visible features to preserve

- responsive desktop sidebar, mobile header, and bottom navigation
- dark/light theme switching
- home feed with Story bar, post carousel, double-tap/toolbar likes, saves, comments, likes/share/detail modals, and suggestions
- Explore grid and post detail modal
- Reel vertical view with playback click, mute, like, save, and share UI
- direct-message conversation list, tabs, active chat, and local text send
- profile header, counts, highlights, tabs, grids, and edit profile/avatar modal
- create-post selection/preset, filter, caption, location, and publish flow
- Story opening, timed/explicit navigation, pause/play, local reaction/reply input, and close
- search and notifications drawers

Phase 0 regression tests exercise Story navigation and close, feed likes/comments, local message send, and reachability of the feed, Explore, Reels, messages, profile, and create-post views.
