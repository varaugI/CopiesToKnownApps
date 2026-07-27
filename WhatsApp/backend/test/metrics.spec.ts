import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { MetricsModule } from "../src/modules/metrics/metrics.module";

describe("Phase 2 Backend — Prometheus Metrics", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule]
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  test("GET /metrics returns Prometheus metric payload", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/metrics"
    });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toContain("connectchat_http_requests_total");
  });
});
