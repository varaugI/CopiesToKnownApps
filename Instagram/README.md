# PhotoFlow

PhotoFlow is a learning-grade social-media platform being built incrementally from a React UI prototype. Phase 1 establishes a typed, URL-driven frontend foundation while preserving the original mock interactions.

## Current status: routed mock frontend

There is still **no backend, authentication, database, API integration, object storage, media worker, realtime messaging, or server-side authorization**. Login and registration URLs display honest Phase 3 notices; they do not simulate authentication success.

The current data path is:

```text
mockData.js
  -> typed, feature-scoped React providers
  -> lazy route components
  -> localStorage for selected mock state
```

TanStack Query and a typed API client boundary are configured for later server integration, but no component silently falls back from a failed API call to mock data.

## Routes

| Route | Current screen |
| --- | --- |
| `/` | Home feed |
| `/login` | Reserved authentication notice |
| `/register` | Reserved registration notice |
| `/explore` | Explore grid |
| `/reels` | Reels |
| `/direct` | Direct messages |
| `/direct/:conversationId` | Deep-linked mock conversation |
| `/accounts/edit` | Profile with validated edit dialog |
| `/:username` | Current mock profile |
| `/p/:postId` | Deep-linked post detail |
| `/stories/:username/:storyId` | Deep-linked Story viewer |

React Router owns navigation, active states, deep links, and browser Back/Forward behavior. Primary route components are loaded through `React.lazy`.

Production hosting must rewrite unknown application paths to `index.html` so browser deep links reach the client router.

## Frontend state boundaries

The former all-purpose `AppContext` has been removed. State is now divided into:

- `UiProvider`: theme and transient drawers/modals
- `ProfileProvider`: current profile and profile persistence
- `PostsProvider`: posts, comments, post reactions, Explore mapping, and post persistence
- `StoriesProvider`: Story groups and local seen state
- `ReelsProvider`: Reel reaction state
- `MessagingProvider`: mock conversations and local message persistence
- `NotificationsProvider`: notification and unread state

`AppProviders` composes those scopes. TanStack Query is reserved for server state once backend endpoints exist.

## Typed foundation

TypeScript now covers:

- application entry and router
- domain models
- feature providers
- browser-storage helpers
- typed API client and centralized error mapping
- QueryClient configuration
- Error Boundary
- dialog foundation
- profile-edit form

Existing JavaScript components remain supported during the incremental migration. Strict type checking applies to TypeScript files; JavaScript checking remains disabled until each file is migrated deliberately.

The API client stores an access token only in memory, uses credentialed requests for future secure cookies, supports `AbortSignal`, maps HTTP failures centrally, and does not persist tokens.

## Mock persistence

| Key | Current contents |
| --- | --- |
| `insta_theme` | theme |
| `insta_user` | edited mock profile and avatar |
| `insta_posts` | posts, likes, saves, and comments |
| `insta_chats` | mock and locally sent message bodies |

Clearing site storage still loses local changes. Stories, Reels, and notifications are not durable.

## Requirements and setup

- Node.js 22 LTS or a newer compatible release
- npm 10 or newer

```bash
cp .env.example .env
npm ci
npm run dev
```

On PowerShell systems that block `npm.ps1`, use `npm.cmd`.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```

Tests cover preserved feed/Story/message behavior, direct route loading, browser history, post and Story deep links, accessible dialog behavior, profile validation and persistence, API-client token/error behavior, and top-level error recovery.

## Documentation

- [Phase 0 repository audit](docs/audits/phase-0-repository-audit.md)
- [ADR 0001: platform foundation](docs/adr/0001-platform-foundation.md)
- [Phase 1 frontend foundation](docs/phase-1-frontend-foundation.md)

## Known limitations

- Server data and authentication are not implemented.
- Local browser persistence is not a security boundary.
- Post creation still uses browser Base64 media.
- Some legacy JSX remains.
- Several legacy drawers and secondary modals still need complete focus-management migration.
- Reel viewport playback, server search, upload pipelines, and realtime messaging belong to later phases.

## Next phase

Phase 2 creates the NestJS/Fastify backend foundation, validated configuration, API versioning, structured errors/logging, request IDs, PostgreSQL/Prisma, Redis connectivity, health/readiness endpoints, graceful shutdown, and Testcontainers baselines.
