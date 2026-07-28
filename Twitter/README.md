# Chirp

A polished, interactive Twitter-inspired social client built as an unofficial
frontend demo. It uses synthetic accounts and posts and never connects to
Twitter/X services.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3001`.

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
- Keyboard shortcuts: `N` to compose and `/` to focus global search

Generated feed artwork is original and stored under `public/media`.
