import { ApiError, badRequest } from "@/server/errors";

export interface ApiMeta {
  requestId: string;
  storageMode?: "memory";
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiFailure {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type RouteContext<Key extends string> = {
  params: Record<Key, string> | Promise<Record<Key, string>>;
};

const REQUEST_ID_MAX_LENGTH = 100;

function requestIdFor(request: Request): string {
  const supplied = request.headers.get("x-request-id")?.trim();
  if (supplied && supplied.length <= REQUEST_ID_MAX_LENGTH) return supplied;
  return globalThis.crypto?.randomUUID?.() ?? `request-${Date.now()}`;
}

function responseHeaders(
  requestId: string,
  extraHeaders?: HeadersInit,
): Headers {
  const headers = new Headers(extraHeaders);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set("cross-origin-resource-policy", "same-origin");
  headers.set("x-request-id", requestId);
  return headers;
}

export function apiJson<T>(
  request: Request,
  data: T,
  options: {
    status?: number;
    meta?: Record<string, unknown>;
    headers?: HeadersInit;
  } = {},
): Response {
  const requestId = requestIdFor(request);
  const payload: ApiSuccess<T> = {
    data,
    meta: {
      requestId,
      ...options.meta,
    },
  };

  return new Response(JSON.stringify(payload), {
    status: options.status ?? 200,
    headers: responseHeaders(requestId, options.headers),
  });
}

export function apiErrorResponse(request: Request, error: unknown): Response {
  const requestId = requestIdFor(request);
  const apiError =
    error instanceof ApiError
      ? error
      : new ApiError({
          status: 500,
          code: "INTERNAL_ERROR",
          message: "The request could not be completed.",
        });
  const payload: ApiFailure = {
    error: {
      code: apiError.code,
      message: apiError.message,
      ...(apiError.details === undefined ? {} : { details: apiError.details }),
    },
  };

  return new Response(JSON.stringify(payload), {
    status: apiError.status,
    headers: responseHeaders(requestId, apiError.headers),
  });
}

export async function handleApiRequest(
  request: Request,
  handler: () => Response | Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}

export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown>> {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw badRequest("INVALID_JSON", "The request body must contain valid JSON.");
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw badRequest("INVALID_BODY", "The request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

export interface StringFieldOptions {
  required?: boolean;
  allowEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
}

export function stringField(
  body: Record<string, unknown>,
  key: string,
  options: StringFieldOptions = {},
): string | undefined {
  const value = body[key];
  if (value === undefined || value === null) {
    if (options.required) {
      throw badRequest(
        "VALIDATION_ERROR",
        `'${key}' is required.`,
        { field: key },
      );
    }
    return undefined;
  }
  if (typeof value !== "string") {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' must be a string.`,
      { field: key },
    );
  }

  const normalized = value.trim();
  if (!options.allowEmpty && normalized.length === 0) {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' cannot be empty.`,
      { field: key },
    );
  }
  if (
    options.minLength !== undefined &&
    normalized.length < options.minLength
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' must be at least ${options.minLength} characters.`,
      { field: key, minLength: options.minLength },
    );
  }
  if (
    options.maxLength !== undefined &&
    normalized.length > options.maxLength
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' must be at most ${options.maxLength} characters.`,
      { field: key, maxLength: options.maxLength },
    );
  }
  return normalized;
}

export function stringArrayField(
  body: Record<string, unknown>,
  key: string,
  options: { maxItems?: number; maxItemLength?: number } = {},
): string[] | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' must be an array of strings.`,
      { field: key },
    );
  }
  if (options.maxItems !== undefined && value.length > options.maxItems) {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' accepts at most ${options.maxItems} items.`,
      { field: key, maxItems: options.maxItems },
    );
  }

  const normalized = value.map((item) => item.trim()).filter(Boolean);
  if (
    options.maxItemLength !== undefined &&
    normalized.some((item) => item.length > options.maxItemLength!)
  ) {
    throw badRequest(
      "VALIDATION_ERROR",
      `Items in '${key}' must be at most ${options.maxItemLength} characters.`,
      { field: key, maxItemLength: options.maxItemLength },
    );
  }
  return normalized;
}

export async function routeParam<Key extends string>(
  context: RouteContext<Key>,
  key: Key,
): Promise<string> {
  const params = await context.params;
  const value = params[key]?.trim();
  if (!value) {
    throw badRequest(
      "MISSING_ROUTE_PARAMETER",
      `Route parameter '${key}' is required.`,
      { field: key },
    );
  }
  try {
    return decodeURIComponent(value);
  } catch {
    throw badRequest(
      "INVALID_ROUTE_PARAMETER",
      `Route parameter '${key}' is invalid.`,
      { field: key },
    );
  }
}
