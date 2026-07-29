# Chirp backend

Chirp exposes its social features through same-origin REST endpoints under
`/api`. The API is implemented with App Router route handlers and Web Platform
APIs, so the same code runs in local vinext development and in the hosted
server build.

This is an original demo backend with synthetic users and content. It does not
connect to, proxy, or scrape Twitter/X.

## Run it

```bash
npm install
npm run dev
```

The API is served from the same origin as the web app. With the default local
port:

```bash
curl http://localhost:3001/api/health
curl -H "X-Chirp-User: u-me" http://localhost:3001/api/bootstrap
```

Every successful response uses a `data` envelope:

```json
{
  "data": {},
  "meta": {}
}
```

Errors are machine-readable:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Post text must be 280 characters or fewer.",
    "details": {}
  }
}
```

## Authentication

The hosted project is owner-only and the API uses a deliberately limited,
spoofable demo identity model. A request may identify one of the seeded users
with the `X-Chirp-User` header. The demo session endpoint can also set an
HTTP-only, same-site cookie. If neither is present, the API uses the seeded
`u-me` identity.

This keeps authorization decisions on the server without pretending the demo
provides production account security. A public deployment should replace this
adapter with real account registration, password or passkey handling, session
rotation, CSRF protection, and abuse controls.

## Endpoints

### Service and initial state

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service health and active storage mode |
| `GET` | `/api/bootstrap` | Current user, timelines, interactions, notifications, trends, and conversations |
| `GET` | `/api/auth/session` | Resolve the current demo identity |
| `POST` | `/api/auth/demo` | Start a demo session |

### Posts and social graph

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/posts` | Paginated or filtered posts |
| `POST` | `/api/posts` | Create a post |
| `GET` | `/api/posts/:id` | Fetch a post and its thread |
| `DELETE` | `/api/posts/:id` | Delete a post owned by the current user |
| `POST` | `/api/posts/:id/replies` | Reply to a post |
| `PUT`, `DELETE` | `/api/posts/:id/like` | Add or remove a like |
| `PUT`, `DELETE` | `/api/posts/:id/repost` | Add or remove a repost |
| `PUT`, `DELETE` | `/api/posts/:id/bookmark` | Add or remove a bookmark |
| `GET` | `/api/users/:handle` | Fetch a public profile |
| `PATCH` | `/api/users/me` | Update the current profile |
| `PUT`, `DELETE` | `/api/users/:id/follow` | Follow or unfollow a user |
| `GET` | `/api/search?q=...` | Search users, posts, and trends |
| `GET` | `/api/notifications` | Fetch the current user's notifications |

### Direct messages

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/conversations` | List conversations for the current user |
| `POST` | `/api/conversations` | Start or resolve a conversation |
| `GET` | `/api/conversations/:id/messages` | Fetch conversation messages |
| `POST` | `/api/conversations/:id/messages` | Send a message |
| `PATCH` | `/api/conversations/:id/read` | Mark a conversation as read |

Mutation requests should send `Content-Type: application/json`. Post text is
limited to 280 characters, message text to 1,000 characters, and user-supplied
IDs and profile fields are validated before reaching the repository.

## Persistence model

The API depends on a repository interface. The bundled adapter is
`MemoryRepository`, seeded from the same synthetic dataset as the client.
Mutations are shared by requests that reach the same live runtime instance, but
they are not durable across worker eviction or deployment. `/api/health` and
`/api/bootstrap` report this storage mode explicitly.

The client applies mutations optimistically, saves its local state, and
best-effort synchronizes them to the API. It remains usable during a network
failure, while server validation and authorization still exercise the real
backend when it is available.

For durable multi-user production use, implement the same repository interface
with a transactional database such as D1 or PostgreSQL and bind it in the
deployment environment. The API layer and frontend contract do not need to
change.

## Safety and HTTP behavior

- Mutations authorize against the current server-resolved user.
- Only a post owner can delete that post.
- Conversation reads and writes require membership.
- Responses are JSON, marked `Cache-Control: no-store`, and include defensive
  content-type and framing headers.
- Unknown routes and methods return structured `404` or `405` errors.
- The bundled rate limiter is best-effort and process-local; it is a demo guard,
  not a distributed abuse-prevention system.
- Composer file previews use browser `blob:` URLs and are session-local. A
  durable deployment needs an object-storage upload adapter.
- The API never accepts or stores real Twitter/X credentials.
