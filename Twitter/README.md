# Chirp

A polished, interactive Twitter-inspired social app with a same-origin REST
backend. It uses synthetic accounts and posts and never connects to Twitter/X
services.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3001`.

The API runs from the same process:

```bash
curl http://localhost:3001/api/health
curl -H "X-Chirp-User: u-me" http://localhost:3001/api/bootstrap
```

## Verify

```bash
npm run verify
```

The verification pipeline runs Oxlint, TypeScript, Vitest, and a production
vinext build.

## Included

- Responsive three-column desktop shell and mobile bottom navigation
- For You and Following timelines
- Compose, reply, like, repost, bookmark, share, and media viewer flows
- Explore/search, notifications, direct messages, profiles, and post threads
- Bookmarks, Lists, Premium, Grok-style assistant, and Settings screens
- Follow state, profile editing, theme selection, and local persistence
- REST APIs for posts, replies, reactions, follows, profiles, notifications,
  search, conversations, and messages
- Server-side validation, authorization checks, structured errors, and
  best-effort rate limiting
- Optimistic API synchronization with a resilient browser-local fallback
- Keyboard shortcuts: `N` to compose and `/` to focus global search

Generated feed artwork is original and stored under `public/media`.

The connected Sites project has no durable database binding, so the bundled
server repository is intentionally in-memory and resets when the hosted runtime
restarts or is redeployed. Browser state remains locally persisted. See
[docs/BACKEND.md](docs/BACKEND.md) for the API contract, demo identity model,
and the production persistence boundary.
