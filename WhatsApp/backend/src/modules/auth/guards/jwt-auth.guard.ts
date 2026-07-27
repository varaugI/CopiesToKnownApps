import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
      if (!payload.sub || !payload.deviceId || payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException("Token expired or invalid");
      }
      (req as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token signature");
    }
  }
}
