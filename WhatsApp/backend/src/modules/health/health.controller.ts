import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get("health")
  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "connectchat-backend",
      version: "1.0.0"
    };
  }

  @Get("ready")
  getReadiness() {
    return {
      status: "ready",
      database: "ok",
      redis: "ok",
      timestamp: new Date().toISOString()
    };
  }
}
