import { CURRENT_USER_ID } from "@/data/mockData";
import { unauthorized } from "@/server/errors";
import type { ChirpRepository } from "@/server/repository";
import type { User } from "@/types";

export const DEMO_USER_HEADER = "X-Chirp-User";
export const DEMO_USER_COOKIE = "chirp_demo_user";

export interface DemoSession {
  user: User;
  source: "header" | "cookie" | "fallback";
}

function cookieValue(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;
    const value = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function resolveDemoSession(
  request: Request,
  repository: ChirpRepository,
): DemoSession {
  const headerUserId = request.headers.get(DEMO_USER_HEADER)?.trim();
  const cookieUserId = cookieValue(request, DEMO_USER_COOKIE)?.trim();
  const userId = headerUserId || cookieUserId || CURRENT_USER_ID;
  const source = headerUserId
    ? "header"
    : cookieUserId
      ? "cookie"
      : "fallback";
  const user = repository.findUser(userId);

  if (!user) {
    throw unauthorized(`Demo user '${userId}' is not available.`);
  }
  return { user, source };
}

export function demoSessionCookie(userId: string, request?: Request): string {
  const forwardedProtocol = request?.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const isSecure =
    forwardedProtocol === "https" ||
    (request ? new URL(request.url).protocol === "https:" : false);
  return [
    `${DEMO_USER_COOKIE}=${encodeURIComponent(userId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=2592000",
    ...(isSecure ? ["Secure"] : []),
  ].join("; ");
}
