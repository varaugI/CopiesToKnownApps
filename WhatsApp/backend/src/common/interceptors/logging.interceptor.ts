import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FastifyRequest, FastifyReply } from "fastify";
import { MetricsService } from "../../modules/metrics/metrics.service";

@Injectable()
export class StructuredLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<FastifyRequest>();
    const res = httpCtx.getResponse<FastifyReply>();

    const requestId = (req.headers["x-request-id"] as string) || `req_${Date.now()}`;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = (Date.now() - startTime) / 1000;
          const statusCode = res.statusCode;
          const route = (req as any).routerPath || req.url;

          this.metricsService.httpRequestsTotal.inc({
            method: req.method,
            route,
            status: statusCode.toString()
          });

          this.metricsService.httpRequestDurationSeconds.observe(
            {
              method: req.method,
              route,
              status: statusCode.toString()
            },
            duration
          );

          this.logger.log(
            JSON.stringify({
              requestId,
              method: req.method,
              url: req.url,
              statusCode,
              durationMs: Date.now() - startTime
            })
          );
        }
      })
    );
  }
}
