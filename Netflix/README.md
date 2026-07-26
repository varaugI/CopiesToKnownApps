# StreamFlix - Enterprise Netflix Application Ecosystem

A full-stack streaming platform architecture engineered with **React 18**, **Angular 18**, **Node.js Express REST API**, and **Java 21 / Spring Boot 3**.

---

## 🌟 Key Features & Ecosystem Components

### 1. ⚛️ React 18 Netflix Client (Vite SPA)
- **Multi-Profile Selector**: Switch profiles with custom avatars & watchlists ("Gaurav", "Cinema Buff", "Kids Zone", "Sci-Fi Fanatic").
- **Dynamic Sticky Navbar**: Smooth background gradient transition on scroll, expanding search input bar, notification popovers, profile menu.
- **Hero Billboard Banner**: Auto-playing video backdrop trailer with mute/unmute audio control, Play, More Info, and Add to My List buttons.
- **Horizontal Content Carousels**: Smooth horizontal scrolling rows ("Trending Now", "Sci-Fi Blockbusters", "Top 10 Today", "My List") with navigation arrows.
- **Hover Card Expansion**: Video previews, match scores (e.g. 98% Match), age ratings, 4K badges, and instant action buttons on hover.
- **Detailed Movie/Show Modal**: Comprehensive show overview, season/episode list with duration & thumbnails, and "More Like This" recommendations grid.
- **Fullscreen Custom Video Player**: Custom controls with scrub seek bar, 10s skip backward/forward, skip intro button, audio & subtitles selector, playback speed controls (0.5x - 2x).
- **Client Performance & State**: Dynamic code splitting (`React.lazy` + `Suspense`), component memoization (`React.memo`), structured state management, and HLS integration.

### 2. 🅰️ Angular 18 Netflix Client (`/angular-app`)
- **RxJS Data Services**: Connected to backend API endpoints with typed services.
- **Standalone Components**: Clean, reactive UI with hero banner, category carousels, movie detail modal, search filter, and video player.

### 3. ⚡ Node.js Express REST API (`/server` - Legacy Prototype)
- **Prototype Cache Layer**: In-memory cache (Phase 6 target: Redis distributed cache).
- **Rate Limiting**: Sliding-window rate limiters.
- **Simulated Video Endpoint**: HTTP Range response header verification (Phase 5 target: MinIO + FFmpeg HLS pipeline).
- **Node.js Cluster Prototype**: Multi-core worker process fork.

- **HTTP Compression & Security**: Gzip/Brotli response compression (`compression`) and `helmet` security headers.

---

## 📂 Repository Structure

```
NetflixCopy/
├── src/                    # React 18 Client Application
│   ├── components/         # Navbar, Billboard, MovieCard, ContentRow, MovieModal, VideoPlayer, SearchResults
│   ├── context/            # AppContext (State Management & Live API Sync)
│   ├── data/               # Mock data store & fallback media assets
│   └── index.css           # Netflix dark theme design system
├── server/                 # High-Scale Node.js Express REST API Server
│   ├── config/             # Sub-millisecond Memory Cache Layer
│   ├── data/               # Centralized media database
│   ├── middleware/         # Sliding-window rate limiters & security
│   ├── services/           # HTTP Range video chunk streaming service
│   └── index.js            # Express app with CPU clustering
├── angular-app/            # Angular 18 Netflix Application
│   └── src/app/            # AppComponent, RxJS NetflixService
├── run-all.js              # Unified multi-app process launcher
└── package.json            # Root configuration & scripts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
cd server && npm install
cd ../angular-app && npm install --legacy-peer-deps
```

### 2. Run All Ecosystem Services Concurrently
```bash
node run-all.js
```

Or launch services individually:
- **Node.js API Server** (Port 5000): `cd server && npm start`
- **React Netflix App** (Port 3000): `npm run dev`
- **Angular Netflix App** (Port 4200): `cd angular-app && npm start`

---

## 📡 API Endpoint Specifications

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check, cluster worker PID, cache stats |
| `/api/metrics` | `GET` | System metrics, uptime, memory, and cache hit rates |
| `/api/movies` | `GET` | Catalog titles (supports `?category=`, `?genre=`, `?type=`) |
| `/api/movies/:id` | `GET` | Single title metadata & recommended titles |
| `/api/billboard` | `GET` | Featured hero title |
| `/api/categories` | `GET` | Available catalog categories |
| `/api/profiles` | `GET` | User profile list |
| `/api/search?q=...` | `GET` | Instant title/genre/cast search |
| `/api/stream/:id` | `GET` | HTTP Range chunked video stream (`206 Partial Content`) |
| `/api/mylist/:profileId` | `GET` / `POST` | Watchlist retrieval and toggle endpoint |

---

## 📄 License
MIT License. Built for demonstration and enterprise architecture reference.
