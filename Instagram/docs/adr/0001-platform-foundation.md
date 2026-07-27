# ADR 0001: PhotoFlow platform foundation

- Status: Accepted
- Date: 2026-07-26
- Decision owners: PhotoFlow maintainers
- Scope: Target architecture; Phase 0 implements only the frontend quality baseline

## Context

PhotoFlow starts as a React/Vite UI prototype with mock data and browser persistence. The learning goal is to add durable identity, social graph, media, feed, messaging, notification, search, moderation, and operations capabilities without prematurely distributing the system.

The architecture must make correctness, privacy boundaries, direct-to-object-storage uploads, durable messages, idempotent jobs, and measured scaling understandable. It must also leave room for later search and event-streaming experiments without making those systems foundation dependencies.

## Decision

### Frontend: React and TypeScript

Keep React and Vite, then migrate JavaScript/JSX incrementally to TypeScript. React Router will own URLs, TanStack Query will own server state, React Hook Form plus Zod will own form state and validation, and Socket.IO client will carry realtime events. Context will remain only for narrow cross-cutting browser concerns.

TypeScript is selected for shared contract clarity and safer incremental refactoring. Runtime validation remains necessary because TypeScript does not validate network or persisted input.

### Backend: NestJS with the Fastify adapter

Create a Node.js TypeScript backend under `backend/` in Phase 2. NestJS supplies module composition, dependency injection, request lifecycle facilities, testing support, and clear controller/service boundaries. Fastify is selected as the HTTP adapter for its lower overhead and schema-oriented request handling.

The backend begins as a stateless modular monolith. Modules will be separated by product capability, with concrete boundaries only where they support validation, authorization, domain logic, persistence, jobs, events, or tests. Multiple API replicas must be possible without process-local source-of-truth state.

### Source of truth: PostgreSQL

PostgreSQL will hold accounts, sessions, profiles, social graph, content metadata, reactions, conversations, durable messages, notifications, moderation, audit records, feed state, and transactional outbox events.

Relational constraints and transactions are important for follow uniqueness, private-account rules, reaction idempotency, message ordering, and outbox consistency. Public API responses will use mapped DTOs and opaque public identifiers rather than raw database rows.

### Shared ephemeral state: Redis

Redis will be used only for explicitly ephemeral or performance-oriented shared state: rate limits, bounded caches, Socket.IO coordination, presence, typing, short-lived idempotency records, and selected unread counters. Every key family will have a naming convention, version, serialization format, and TTL/invalidation policy.

Redis failure may reduce performance or ephemeral functionality, but must not corrupt PostgreSQL source-of-truth data or lose durable messages.

### Initial jobs: BullMQ

BullMQ will handle bounded background work such as media processing, notification generation, Story expiry, search indexing, cleanup, email, fan-out experiments, and reconciliation. Processors must validate payloads, use deterministic job identity where possible, be idempotent, bound retries and timeouts, expose failures, and carry trace/correlation identifiers.

A PostgreSQL transactional outbox will bridge committed domain changes to asynchronous work. The delivery model is at least once, so consumers must tolerate duplicates.

### Object storage: MinIO

MinIO provides an S3-compatible local object store. Browsers will upload media with short-lived signed URLs after the API authenticates the actor and creates a safe upload session. The API stores metadata and authorization state; it does not accept full production media files through JSON or store Base64 media in PostgreSQL/Redis.

Private media will require authorization-aware delivery. Object keys and signed URLs are implementation details and will not be exposed in durable public contracts.

### Video processing: FFmpeg worker

A separate worker will invoke FFmpeg for validated video metadata, poster generation, playback renditions, and later HLS where justified. Image processing will use a purpose-built image library in the same worker boundary. Temporary files must be isolated and cleaned, outputs deterministic, retries bounded, and asset states durable.

Separating CPU-heavy processing protects API latency and allows workers to scale independently without prematurely extracting a network service.

### Deployment shape: modular monolith first

The initial deployable application consists of a frontend, stateless API replicas, and one or more worker processes sharing PostgreSQL, Redis, and MinIO. Product modules remain in one backend codebase and one primary database until measurements show a boundary needs independent ownership or scaling.

This keeps transactions and learning paths visible while still requiring replica-safe state management.

### Deferred systems

OpenSearch is deferred until PostgreSQL full-text/trigram search and an outbox-backed search interface work. Redpanda/Kafka is deferred until BullMQ and the transactional outbox demonstrate the event model. Kubernetes is deferred until Docker Compose, health checks, clean builds, tests, and observability work locally.

Deferral is an explicit decision, not a rejection. Interfaces and outbox schemas should make later substitution possible without changing controllers or frontend contracts.

## Alternatives considered

| Area | Alternative | Why not selected initially |
| --- | --- | --- |
| Frontend language | Continue JavaScript only | Lower migration effort, but weaker contracts across a rapidly growing API surface |
| Frontend framework | Replace React | Discards a working UI and adds no learning value for the requested goals |
| Backend framework | Express without structure | Flexible, but requires recreating module, lifecycle, validation, and testing conventions |
| HTTP adapter | NestJS default Express | Mature and acceptable, but Fastify offers a better performance/schema baseline |
| Persistence | MongoDB/document database | Flexible content documents do not offset weaker relational enforcement for graph, sessions, reactions, and messaging |
| ORM | Handwritten SQL only | Maximum control, but higher migration/mapping cost for the learning roadmap; targeted SQL remains possible through Prisma |
| Ephemeral state | Process-local maps | Breaks correctness across replicas and loses state on restart |
| Jobs | In-process callbacks/cron only | Work is lost on crash and cannot provide shared backpressure or durable inspection |
| Object storage | API filesystem uploads | Couples files to one replica and makes direct upload, scaling, and privacy harder |
| Video | Process media inside API requests | Couples request latency to CPU-heavy, failure-prone work |
| Architecture | Microservices immediately | Adds distributed transactions, deployments, networking, and observability before module boundaries are proven |
| Search | OpenSearch immediately | Adds operational complexity before query contracts and synchronization are proven |
| Streaming | Kafka/Redpanda immediately | Adds partitions, consumer operations, and schema evolution before event volume justifies them |

## Consequences

Positive consequences:

- PostgreSQL transactions can enforce core social and messaging invariants.
- API and worker replicas can scale horizontally because durable state is external.
- The media path avoids JSON/Base64 uploads and API-process bandwidth bottlenecks.
- Module boundaries can be tested before any service extraction.
- Deferred adapters keep advanced infrastructure a measured learning step.

Costs and risks:

- NestJS, Prisma, Redis, BullMQ, MinIO, and FFmpeg create a substantial local toolchain.
- A modular monolith still requires discipline to prevent cross-module data access.
- PostgreSQL search has limits that may eventually justify OpenSearch.
- BullMQ is at-least-once; idempotency and reconciliation are mandatory.
- Signed-upload and media-state workflows are more complex than API file uploads, but are necessary for the intended architecture.

## Guardrails

- Phase 0 remains mock frontend only.
- Phase 1 may create a typed API boundary but may not pretend an API exists.
- Phase 2 introduces the backend foundation; product capabilities follow the roadmap order.
- No access token will be stored in `localStorage`.
- No uploaded media will be stored as Base64 in browser persistence, PostgreSQL, or Redis once backend media flows begin.
- No microservice, OpenSearch, Redpanda/Kafka, or Kubernetes work begins before its prerequisite phase passes.
- Scaling claims require recorded environment, load, latency, errors, resource use, and bottlenecks.

## Revisit triggers

Revisit a decision only with evidence such as sustained queue isolation needs, independently scaling media CPU, message delivery requirements, PostgreSQL search limitations, ownership boundaries, database contention, deployment blast radius, or measured hot keys. Service extraction is an evaluation outcome, not a roadmap default.
