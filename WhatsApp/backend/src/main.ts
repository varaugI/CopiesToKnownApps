import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { GlobalHttpExceptionFilter } from "./common/filters/http-exception.filter";
import { StructuredLoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { MetricsService } from "./modules/metrics/metrics.service";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  );

  const configService = app.get(ConfigService);
  const metricsService = app.get(MetricsService);

  // Global API Prefix
  app.setGlobalPrefix("api/v1");

  // Global Exception Filter & Interceptors
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new StructuredLoggingInterceptor(metricsService));

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // CORS Configuration
  app.enableCors({
    origin: true,
    credentials: true
  });

  const port = configService.get<number>("PORT") || 3000;
  const host = configService.get<string>("HOST") || "0.0.0.0";

  await app.listen(port, host);
  logger.log(`ConnectChat Stateless Modular Monolith running on http://${host}:${port}/api/v1`);
}

bootstrap();
