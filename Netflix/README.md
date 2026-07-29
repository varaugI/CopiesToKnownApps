# Netflix interface copy

This is the canonical Netflix copy in the workspace. The previous implementation is preserved
unchanged in `../Netflix-ReactVite`.

## Stack

- React 18 + TypeScript for the browser client
- Java 21 + Spring Boot 3 for the catalog API boundary
- Vite for local client tooling

Netflix has publicly documented React-based JavaScript interfaces and a service estate in which
Java is the predominant language. This project follows those public runtime choices without
pretending to reproduce Netflix's private production platform.

Public engineering references:

- [Crafting a high-performance TV user interface using React](https://netflixtechblog.com/crafting-a-high-performance-tv-user-interface-using-react-3350e5a6ad3b)
- [Prana: A Sidecar for your Netflix PaaS based Applications and Services](https://netflixtechblog.com/prana-a-sidecar-for-your-netflix-paas-based-applications-and-services-258a5790a015)

## Run it

Frontend:

```bash
npm install
npm run dev
```

Spring Boot API (optional because the client includes a fallback catalog):

```bash
cd backend
mvn spring-boot:run
```

The client runs on `http://localhost:3000` and proxies `/api` to the Java service on port `8080`.

## Features

- Profile selection and switching
- Responsive browse experience with hero billboard and content rows
- Search across titles, cast, formats, and genres
- My List persistence in local storage
- Top 10 and Continue Watching presentations
- Hover previews, title details, episodes, and demo playback
- Keyboard-friendly controls, reduced-motion support, and responsive layouts

All catalog names and descriptions in this learning project are fictional. Remote Unsplash images
are used as replaceable demo artwork.
