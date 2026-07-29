export interface ApiErrorOptions {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  headers?: HeadersInit;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly headers: Headers;

  constructor({
    status,
    code,
    message,
    details,
    headers,
  }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.headers = new Headers(headers);
  }
}

export function badRequest(
  code: string,
  message: string,
  details?: unknown,
): ApiError {
  return new ApiError({ status: 400, code, message, details });
}

export function unauthorized(message = "A valid demo user is required."): ApiError {
  return new ApiError({
    status: 401,
    code: "UNAUTHORIZED",
    message,
  });
}

export function forbidden(message = "You are not allowed to perform this action."): ApiError {
  return new ApiError({
    status: 403,
    code: "FORBIDDEN",
    message,
  });
}

export function notFound(resource: string, id?: string): ApiError {
  return new ApiError({
    status: 404,
    code: `${resource.toUpperCase()}_NOT_FOUND`,
    message: id ? `${resource} '${id}' was not found.` : `${resource} was not found.`,
  });
}

export function conflict(
  code: string,
  message: string,
  details?: unknown,
): ApiError {
  return new ApiError({ status: 409, code, message, details });
}
