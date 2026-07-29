# StreamFlix Architecture Overview

## Canonical Stack & System Target Architecture
StreamFlix is designed as a learning-grade streaming platform built with modern distributed systems principles.

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   +------------------------------------+  +-------------------------+   |
|   |  React 18 + TypeScript Client SPA  |  | Angular 18 Secondary    |   |
|   |  (Vite, React Router, HLS.js)      |  | Client                  |   |
|   +------------------------------------+  +-------------------------+   |
+------------------------------------+------------------------------------+
                                     |
                                REST | WebSocket
                                     v
+-------------------------------------------------------------------------+
|                        SPRING BOOT MODULAR MONOLITH                     |
|  +------------+  +-----------+  +---------------+  +-----------------+  |
|  |  Identity  |  |  Catalog  |  |  Playback     |  |   Watch Party   |  |
|  | & Accounts |  | & Profiles|  | Authorization |  | (STOMP/Redis)   |  |
|  +------------+  +-----------+  +---------------+  +-----------------+  |
+------------------+-------------------+----------------------------------+
                   |                   |
                   v                   v
        +--------------------+   +-------------------+
        | PostgreSQL Database|   | Redis Shared Cache|
        | (Flyway Migrations)|   | & Pub/Sub Store   |
        +--------------------+   +-------------------+
```

### 1. Frontend Clients
- **Primary Client**: React 18 + TypeScript SPA (Vite build)
  - Uses TanStack Query for server state, React Router, and `hls.js` for video playback.
- **Secondary Client**: Angular 18 Application
  - Demonstrates backend API client independence.

### 2. Backend Application API
- **Canonical API**: Java 21 + Spring Boot 3 Modular Monolith (`java-backend`)
  - Modules: Identity, Accounts, Subscriptions, Profiles, Catalog, Media Ingestion, Transcoding, Playback, Watch Progress, My List, Search, Recommendations, Watch Party, Observability.
  - Storage: PostgreSQL with Flyway migrations.
  - Ephemeral & Shared State: Redis (Rate limiting, catalog caching, watch party state, refresh sessions).

### 3. Media Ingestion & Delivery Architecture
- **Object Storage**: MinIO object storage for source videos and HLS output.
- **Media Processing**: FFmpeg background worker generating multi-bitrate HLS variants (.m3u8) and segment files (.ts).
- **Playback Delivery**: Direct Nginx/MinIO static media delivery via signed URLs (no raw media bytes proxied through Spring Boot JVM).

### 4. Legacy Prototype (`server/`)
- Express Node.js server maintained temporarily for route migration comparison.
- Empty 206 fake video streaming disabled and documented.

---

## What Works Currently vs What is Simulated

| Feature | Current Status | Target Architecture (Spring Boot / HLS) |
| ------- | -------------- | --------------------------------------- |
| **Catalog API** | Functional (JSON data in server/Node & Java memory) | PostgreSQL catalog tables with Flyway migrations & Redis cache |
| **Profiles** | Functional (Local & Node memory) | Account-scoped profile entity with parental control rules |
| **My List** | Functional (Local & Node memory, with rollback on failure) | Persistent profile-specific My List database table |
| **Video Streaming** | Refused misleading empty 206 chunks | MinIO + FFmpeg multi-bitrate HLS streaming |
| **Watch Party** | Node in-memory room manager (unauthenticated) | Spring Boot WebSocket/STOMP with Redis pub/sub |
| **Rate Limiting** | Node `express-rate-limit` (MemoryStore) | Redis distributed sliding-window rate limiter |
