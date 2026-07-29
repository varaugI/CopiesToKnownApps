import { dispatchApiRequest } from "@/server/api-router";

export const dynamic = "force-dynamic";

export function GET(request: Request): Promise<Response> {
  return dispatchApiRequest(request, "GET");
}

export function POST(request: Request): Promise<Response> {
  return dispatchApiRequest(request, "POST");
}

export function PUT(request: Request): Promise<Response> {
  return dispatchApiRequest(request, "PUT");
}

export function PATCH(request: Request): Promise<Response> {
  return dispatchApiRequest(request, "PATCH");
}

export function DELETE(request: Request): Promise<Response> {
  return dispatchApiRequest(request, "DELETE");
}
