export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface ApiRequestOptions<TBody> extends Omit<RequestInit, "body"> {
  body?: TBody;
}

function errorCodeForStatus(status: number): ApiErrorCode {
  if (status === 400 || status === 422) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 429) return "RATE_LIMITED";
  return "SERVER_ERROR";
}

function errorMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }
  return fallback;
}

export class ApiClient {
  private accessToken: string | null = null;

  constructor(private readonly baseUrl: string) {}

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  async request<TResponse, TBody = never>(
    path: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");

    let body: BodyInit | undefined;
    if (options.body instanceof FormData) {
      body = options.body;
    } else if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }
    if (this.accessToken) headers.set("Authorization", `Bearer ${this.accessToken}`);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl.replace(/\/$/, "")}${path}`, {
        ...options,
        headers,
        body,
        credentials: "include",
      });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
      throw new ApiClientError("Unable to reach PhotoFlow.", "NETWORK_ERROR", 0, cause);
    }

    if (response.status === 204) return undefined as TResponse;

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (cause) {
      if (response.ok) {
        throw new ApiClientError(
          "PhotoFlow returned an invalid response.",
          "INVALID_RESPONSE",
          response.status,
          cause,
        );
      }
    }

    if (!response.ok) {
      throw new ApiClientError(
        errorMessage(payload, "PhotoFlow could not complete the request."),
        errorCodeForStatus(response.status),
        response.status,
        payload,
      );
    }

    return payload as TResponse;
  }
}

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1",
);
