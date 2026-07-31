"""Small local feed API for the Polymer YouTube interface copy."""

from __future__ import annotations

import argparse
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]
FEED_PATH = ROOT / "src" / "data" / "feed.json"


def load_feed() -> dict:
    with FEED_PATH.open(encoding="utf-8") as feed_file:
        return json.load(feed_file)


def search_feed(feed: dict, query: str) -> list[dict]:
    normalized = query.strip().casefold()
    if not normalized:
        return feed["videos"]
    return [
        video
        for video in feed["videos"]
        if normalized
        in " ".join(
            [
                video["title"],
                video["channel"],
                video["category"],
                video["description"],
            ]
        ).casefold()
    ]


class FeedHandler(BaseHTTPRequestHandler):
    server_version = "YouTubeCopy/1.0"

    def do_GET(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        route = urlparse(self.path)
        feed = load_feed()

        if route.path == "/api/health":
            self._json({"status": "UP", "service": "youtube-copy-feed"})
            return

        if route.path == "/api/feed":
            self._json(feed, cache_seconds=120)
            return

        if route.path == "/api/search":
            query = parse_qs(route.query).get("q", [""])[0]
            self._json({"query": query, "videos": search_feed(feed, query)})
            return

        self._json({"error": "Not found"}, status=HTTPStatus.NOT_FOUND)

    def _json(
        self,
        payload: dict | list,
        *,
        status: HTTPStatus = HTTPStatus.OK,
        cache_seconds: int = 0,
    ) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "http://localhost:3000")
        self.send_header("Cache-Control", f"public, max-age={cache_seconds}")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the YouTube copy feed API")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8081, type=int)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), FeedHandler)
    print(f"Feed API listening on http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
