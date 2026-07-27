import { ZodSchema } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  schema?: ZodSchema<T>
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(response.status, response.statusText, errorData);
  }

  const json = await response.json();

  if (schema) {
    const parseResult = schema.safeParse(json);
    if (!parseResult.success) {
      console.warn("API response validation failed:", parseResult.error);
      return json as T;
    }
    return parseResult.data;
  }

  return json as T;
}
