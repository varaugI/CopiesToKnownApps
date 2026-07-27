# ConnectChat — Realtime Communication Platform

ConnectChat is a learning-grade, full-stack realtime communication platform architecture designed to demonstrate account registration, session management, multi-device synchronization, durable messaging, receipts, media pipeline, WebRTC voice/video calls, and end-to-end encryption.

## Phase 0 Status & Feature Matrix

### 🟢 Working Local Prototype Features
* **Theme Switching**: Dark and Light mode state persistence.
* **Local Chat Navigation**: Tab switching (`/chats`, `/status`, `/channels`, `/calls`, `/profile`, `/settings`).
* **Local Message Search**: In-memory text filtering across loaded contacts and message content.
* **Local Message Creation**: Synchronous append of user messages to local state (with `PENDING_LOCAL` status).
* **Local Profile Management**: Editing profile name, about text, and local avatar photo preview.
* **Channel Follow Toggle**: Local toggling of Channel follow/unfollow states.
* **Status Story Viewer**: Viewing mock contact status updates and closing modal overlays.

### 🟡 Simulated UI Features (Explicitly Labeled)
* **End-to-End Encryption**: **Simulated Banner Only**. Encryption algorithms, identity prekeys, and signal protocol integrations are deferred to Phase 15.
* **Voice & Video Calls**: **UI Demo Overlay Only**. Uses timers and contact avatar mockups. WebRTC peer connections, STUN/TURN, and signaling server integration are deferred to Phase 14.
* **Voice Messages**: **UI Demo Only**. Creates mock audio duration records without microphone recording or Web Audio playback. Real browser recording is deferred to Phase 8.
* **Status Creation & Disappearing Updates**: **UI Demo Only**. 24-hour expiration backend worker and creation flow are deferred to Phase 11.
* **Sent, Delivered, and Read Receipts**: **Local Status Display Only**. Displays `PENDING_LOCAL` clock icons or local state indicators. Real multi-device server delivery receipts are deferred to Phase 6.

---

## Technical Stack & Architecture

* **Frontend**: React 19, Vite, TypeScript, Lucide Icons, React Testing Library, Vitest.
* **State Management**:
  * Server State: TanStack Query (Phase 1)
  * Transient Call State: Zustand (Phase 1)
  * Local Cache & Queue: IndexedDB (Phase 1)
* **Backend**: NestJS, Fastify, PostgreSQL, Prisma ORM, Redis, Socket.IO, BullMQ, MinIO (Phase 2+).
* **Calling**: WebRTC APIs, WebSocket signaling, coturn (Phase 14).

---

## Verification & Test Commands

### Run Vitest Unit Tests
```bash
npm run test
```

### Run Lint (Oxlint)
```bash
npm run lint
```

### Run Type Checking
```bash
npm run typecheck
```

### Build Production Bundle
```bash
npm run build
```

---

## Storage & Security Notes
* **Local Storage**: Currently used for transient UI theme and local mock chats. Access tokens are **never** stored in `localStorage`.
* **Media Handling**: Large attachment binaries are uploaded directly to MinIO via pre-signed S3 URLs. Base64 encoding for storage or JSON transport is disallowed in production phases.
* **Architecture Decision Records**: Detailed ADRs are located in `docs/adr/`.
