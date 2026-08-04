# Audible listening study

This is a high-fidelity, fictional Audible web experience built with a React + TypeScript client and
a Node.js backend-for-frontend (BFF). There was no previous local `Audible` copy, so no archive folder
was created for this app.

## Why this stack

Audible's public Consumer Domains role names JavaScript/TypeScript and React for the team that builds
Audible applications, components, APIs, and desktop/mobile sites. Audible's technology material also
identifies Java, Node.js, REST services, AWS, Web Components, and a web player among its teams and
platforms. This scoped copy uses React + TypeScript and Node.js without claiming one stack represents
every private Audible service.

- [Audible Careers: Technology](https://www.audiblecareers.com/technology)
- [Audible Careers: Tech internships and team stack details](https://www.audiblecareers.com/tech-internships)
- [Amazon Jobs: Audible Consumer Domains front-end role](https://www.amazon.jobs/en/jobs/2981328/senior-front-end-software-engineer-consumer-domains)

Vite is local compilation tooling rather than a claim about Audible's production bundler. The Node
BFF uses the standard library so its API and static-serving boundary remains transparent.

## Included experience

- Responsive Audible-style navigation, search, discovery hero, membership panel, mood browsing,
  continue-listening cards, catalog shelves, and footer
- Persistent desktop player with seeking, skip controls, speed selection, volume, and live progress
- Compact mobile player and mobile-specific header/navigation layout
- Search across titles, authors, narrators, categories, and listening tags
- Library and Wish List views with add/remove interactions
- Title-detail dialog with narrator, ratings, duration, chapters, tags, and sample playback
- Shared fictional catalog used by the React client and Node service
- BFF endpoints for health, discovery, featured titles, library state, and listening progress

All titles, creators, ratings, accounts, memberships, and playback positions are fictional. The
included narration is an original dummy passage and does not contain copyrighted audiobook audio.

## Demo narration

The player uses a real local text-to-speech recording:

- Script: `public/audio/demo-script.txt`
- Recording: `public/audio/audible-demo-narration.wav`
- Voice: Microsoft Zira Desktop
- Encoding: 22.05 kHz, 16-bit, mono PCM WAV

The production Node server advertises `audio/wav` and supports HTTP byte ranges so play, pause,
seeking, speed changes, volume, duration, and end events are driven by the actual media element.
The script is kept with the recording so the demo can be reviewed or regenerated without ambiguity.

## Run and verify

```powershell
npm install
npm run build
npm test
npm start
```

The production app runs at `http://127.0.0.1:4002`. During client development, run `npm run dev` and
`npm start` in separate terminals; Vite proxies `/api` to the Node service.

### API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service and catalog health |
| `GET` | `/api/titles?q=&category=` | Searchable listening catalog |
| `GET` | `/api/titles/:titleId` | Complete title detail |
| `GET` | `/api/categories` | Category and membership counts |
| `GET` | `/api/featured` | Included featured titles |
| `GET` | `/api/recommendations/:titleId` | Contextual six-title recommendation set |
| `GET` | `/api/library` | In-memory demo library with progress |
| `PUT` | `/api/library/:titleId` | Add a title to the library |
| `DELETE` | `/api/library/:titleId` | Remove a title from the library |
| `POST` | `/api/progress` | Validate and save a listening position |
| `GET` | `/api/progress/:titleId` | Resume position, remaining time, and percentage |
| `GET` | `/api/player/:titleId` | Player metadata and generated chapter manifest |
