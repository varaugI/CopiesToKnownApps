# ADR 0001: Canonical Technology Stack and Migration Architecture for StreamFlix

## Status
Accepted

## Context
The legacy repository contains:
1. A React 18 / Vite SPA prototype in JavaScript using mock data and local state.
2. An Angular 18 application prototype relying on hardcoded localhost endpoints and client-side fallbacks.
3. A Node.js / Express REST API prototype using in-memory state (`Map` for caching, watch-parties, user lists, rate limiting) and simulated video streaming (returning headers without media bytes).
4. An incomplete Java Spring Boot backend skeleton in `java-backend` storing catalog in memory with no database, security, or streaming pipeline.
5. Unverified claims of serving 1,000,000+ active users without workload definitions, databases, or performance benchmarks.

To transform this into a production-grade learning streaming platform (StreamFlix), we must define an authoritative technology stack and a clear migration roadmap.

## Decisions

### 1. Primary Frontend: React 18 + TypeScript
- The root React application will be incrementally migrated from JavaScript to TypeScript.
- Tech Stack: React 18, TypeScript, React Router, TanStack Query (server state), React Hook Form, and `hls.js` for HLS video playback.
- Authentication: In-memory short-lived access tokens, secure HTTP-only refresh cookies.

### 2. Canonical Backend: Java 21 + Spring Boot 3
- `java-backend` will be upgraded to Java 21 and Spring Boot 3 as the single canonical backend service.
- Tech Stack:
  - **Core Framework**: Spring Web, Spring Security, Spring Data JPA
  - **Database & Migrations**: PostgreSQL with Flyway
  - **Cache & Ephemeral State**: Redis (rate limiting, catalog caching, watch party state, session store)
  - **Validation & Serialization**: Bean Validation (`jakarta.validation`), Jackson
  - **Testing**: JUnit 5, Testcontainers (PostgreSQL, Redis), Mockito, WireMock
  - **Observability**: Micrometer, Prometheus, OpenTelemetry-compatible tracing

### 3. Secondary Frontend: Angular 18 Client
- The Angular application in `angular-app` is retained.
- After React + Spring Boot implementation reaches stability, Angular will be updated to consume the exact same Spring Boot REST/WebSocket APIs, proving backend client-independence.

### 4. Legacy Backend Strategy: Node.js Express (`server/`)
- `server/` is classified as a legacy prototype.
- During early migration, it will remain functional to compare existing endpoint behavior against Spring Boot endpoints.
- No new features will be added to Node.js; endpoints will be migrated step-by-step to Spring Boot, after which `server/` will be archived/decommissioned.

### 5. Architectural Pattern: Modular Monolith
- Implementation begins with a clean modular monolith inside Spring Boot before considering microservices.
- Modules: `identity`, `accounts`, `subscriptions`, `profiles`, `parental-controls`, `catalog`, `media-ingestion`, `transcoding`, `playback`, `watch-progress`, `my-list`, `search`, `recommendations`, `watch-party`, `notifications`, `observability`.
- Microservice extraction will only be evaluated after load testing proves a concrete bottleneck or isolation requirement.

### 6. Media Pipeline & Playback Architecture
- Spring Boot API authorizes playback requests and issues short-lived signed URLs/tokens.
- Spring Boot API will NOT stream raw media bytes.
- MinIO handles object storage (raw video uploads & HLS output).
- An FFmpeg media worker transcodes uploaded videos into HLS multi-bitrate streams (.m3u8 playlists and .ts segments) and thumbnails.
- Media bytes are delivered directly from MinIO or an Nginx media edge, not proxied through the Spring Boot JVM.

## Consequences
- Eliminates in-process state (`Map`) across multi-worker Node clusters and JVM instances.
- Replaces simulated video streaming (empty 206 responses) with genuine playable HLS streams.
- Establishes full environment configuration for API URLs and client endpoints.
- Prepares system for rigorous end-to-end testing, observability, and load benchmarks.
