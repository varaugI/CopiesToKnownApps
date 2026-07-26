# StreamFlix Learning Guide & Lifecycle Documentation

## Overview
StreamFlix is designed as a learning-grade streaming platform. The goal is to understand how large streaming platforms handle identity, catalog browsing, video ingestion, HLS adaptive streaming, watch progress, My List persistence, watch parties, caching, and distributed system trade-offs.

---

## Phase 0: Audit & Foundation Lifecycle

### What Happens in the Browser (React / Angular)
1. **Catalog Loading**: The browser requests `/api/movies` using the configured API URL (`VITE_API_URL` or `NG_APP_API_URL`).
2. **Error Visibility**: If the backend is offline, React displays a non-silent warning banner rather than silently pretending backend sync succeeded.
3. **My List Toggle**: Clicking "Add to My List" performs an optimistic local UI update. An HTTP POST request is sent to `/api/mylist/:profileId/toggle`. If backend synchronization fails, the frontend displays an error notification and automatically rolls back the optimistic update.
4. **Streaming Attempt**: Requesting playback triggers a playback session request. In Phase 0, legacy empty 206 chunk endpoints return an explicit HTTP 501 (`MEDIA_PIPELINE_NOT_INITIALIZED`) to prevent misleading streaming success claims until the HLS pipeline is online in Phase 5.

### What Happens on the Backend
1. **Node.js Express Prototype (`server/`)**:
   - `/api/metrics` reports process uptime, heap memory, cache stats, and explicit documentation of in-process state limitations.
   - `/api/stream/:id` returns HTTP 501 with structured JSON indicating HLS media pipeline requirement.
2. **Java 21 / Spring Boot 3 (`java-backend`)**:
   - Upgraded pom.xml to Java 21 & Spring Boot 3.2.3.
   - Maven wrapper (`mvnw.cmd`) configured and verified with clean Maven compilation.

---

## Key Developer Lessons in Phase 0

1. **Honesty in System Metrics**: Never hardcode fake user counts (`1,000,000+`) or report fake success on zero-byte stream responses. Real engineering requires empirical measurement.
2. **Optimistic Updates & State Rollback**: Optimistic UI updates provide snappy user experiences, but MUST include rollback logic when the background network request fails.
3. **Process-Local State Pitfalls**: Storing state inside `new Map()` works only for a single process. In multi-worker Node clusters or horizontally scaled JVM instances, process-local maps create split-brain state inconsistencies.
