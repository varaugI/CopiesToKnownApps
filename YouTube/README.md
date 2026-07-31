# YouTube interface copy

This is the canonical YouTube copy in the workspace. The former React/Vite + Spring Boot
implementation is preserved unchanged in `../YouTube-ReactVite`.

## Stack decision

- Polymer 3 and native Custom Elements for the client component model
- JavaScript modules and lazy/restamped views
- Python standard-library HTTP API for the local feed boundary
- Vite as local build tooling only

YouTube publicly documented that its redesigned consumer site was built on Polymer. Its later
performance case study describes a modular client with more than fifty components, a component to
JavaScript-module map, batched loading, and component state-management work. This copy follows that
publicly documented browser architecture.

The small Python API is intentionally local and dependency-free. It is not a claim that YouTube's
private, current backend is a single-language Python application.

First-party references:

- [YouTube: A sneak peek at YouTube's new look and feel](https://blog.youtube/news-and-events/a-sneak-peek-at-youtubes-new-look-and/)
- [web.dev: Building a better web — A faster YouTube](https://web.dev/case-studies/better-youtube-web-part1)

## Run

Client:

```bash
npm install
npm run dev
```

Optional feed API:

```bash
python api/server.py
```

The client runs at `http://localhost:3000` and proxies `/api` to the Python service on port `8081`.
If the API is not running, the same feed is imported as a bundled fallback.

## Included behavior

- Responsive desktop rail, compact rail, and mobile bottom navigation
- Topic filters, search, subscriptions, and Shorts views
- Video watch page with playback, channel actions, expandable description, comments, and recommendations
- Upload and Shorts overlays
- Account menu and dark/light appearance toggle
- Fictional catalog and channel data with replaceable Unsplash artwork
