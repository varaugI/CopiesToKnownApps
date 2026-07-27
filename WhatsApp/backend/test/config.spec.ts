import { describe, test, expect } from "vitest";
import { validateConfig, configSchema } from "../src/config/config.schema";

describe("Phase 2 Backend — Config Validation", () => {
  test("validates default configuration values correctly", () => {
    const parsed = validateConfig({});
    expect(parsed.PORT).toBe(3000);
    expect(parsed.NODE_ENV).toBe("development");
    expect(parsed.DATABASE_URL).toContain("postgresql://");
    expect(parsed.REDIS_URL).toContain("redis://");
  });

  test("throws error on invalid NODE_ENV value", () => {
    expect(() => validateConfig({ NODE_ENV: "invalid_env" })).toThrow();
  });
});
