import { z } from "zod";

export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z
    .string()
    .default("postgresql://postgres:postgres@localhost:5432/connectchat?schema=public"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().default("development_secret_key_change_in_production_32chars"),
  JWT_REFRESH_SECRET: z.string().default("development_refresh_secret_key_change_in_production_32chars"),
  S3_ENDPOINT: z.string().default("http://localhost:9000"),
  S3_ACCESS_KEY: z.string().default("minioadmin"),
  S3_SECRET_KEY: z.string().default("minioadmin"),
  S3_BUCKET_NAME: z.string().default("connectchat-media")
});

export type EnvironmentConfig = z.infer<typeof configSchema>;

export function validateConfig(config: Record<string, unknown>): EnvironmentConfig {
  const result = configSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Config validation error: ${JSON.stringify(result.error.format())}`);
  }
  return result.data;
}
