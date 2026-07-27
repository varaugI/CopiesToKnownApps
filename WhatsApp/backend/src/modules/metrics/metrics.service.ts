import { Injectable, OnModuleInit } from "@nestjs/common";
import { Registry, collectDefaultMetrics, Counter, Histogram } from "prom-client";

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new Registry();

  public readonly httpRequestsTotal: Counter<string>;
  public readonly httpRequestDurationSeconds: Histogram<string>;

  constructor() {
    this.httpRequestsTotal = new Counter({
      name: "connectchat_http_requests_total",
      help: "Total number of HTTP requests processed",
      labelNames: ["method", "route", "status"],
      registers: [this.registry]
    });

    this.httpRequestDurationSeconds = new Histogram({
      name: "connectchat_http_request_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "route", "status"],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry]
    });
  }

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry, prefix: "connectchat_" });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
