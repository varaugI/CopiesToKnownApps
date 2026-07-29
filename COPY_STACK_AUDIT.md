# Copy stack audit

This inventory records the current local implementation of each copy. It does **not** claim that a
company uses only one stack; large products are multi-platform systems and their private production
details change over time. Original-stack verification is done app-by-app from first-party
engineering material before migration.

| Copy | Current local implementation | Status |
| --- | --- | --- |
| Amazon | React + Vite; Java/Maven backend present | Inventory complete |
| Amazon Prime | React + Vite | Inventory complete |
| GitHub | React + Vite | Inventory complete |
| Instagram | React + TypeScript + Vite | Inventory complete |
| LeetCode | React + Vite | Inventory complete |
| MongoDB | React + Vite | Inventory complete |
| Netflix | React + TypeScript client; Java/Spring Boot API | Migrated first |
| Netflix-ReactVite | Preserved React/Vite copy with Angular, Express, and Spring experiments | Archive, unchanged |
| Reddit | React/Vite frontend + Node backend | Inventory complete |
| TikTok | React + Vite | Inventory complete |
| Twitter | React/TypeScript with Next-compatible configuration | Inventory complete |
| WhatsApp | React + TypeScript + Vite; Node backend | Inventory complete |
| YouTube | React + Vite; Java/Maven backend present | Inventory complete |

## Migration convention

1. Verify the target product's publicly documented stack.
2. Rename the existing app by appending its active stack (for example,
   `Netflix` → `Netflix-ReactVite`).
3. Keep the new canonical implementation at the original app name.
4. Do not modify the archived implementation while rebuilding the canonical copy.
5. Build and visually check each app before moving to the next one.

## Netflix decision

Netflix engineering has publicly described React for its JavaScript user interfaces and Java as the
traditional/predominant service language. The canonical local copy therefore uses React +
TypeScript on the client and a Java 21/Spring Boot API boundary. Vite is local build tooling, not a
claim about Netflix's internal production bundler.

First-party engineering references:

- [Netflix: Crafting a high-performance TV user interface using React](https://netflixtechblog.com/crafting-a-high-performance-tv-user-interface-using-react-3350e5a6ad3b)
- [Netflix: Prana and its JVM/Java service context](https://netflixtechblog.com/prana-a-sidecar-for-your-netflix-paas-based-applications-and-services-258a5790a015)
