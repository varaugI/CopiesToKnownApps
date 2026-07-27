import { describe, test, expect } from "vitest";
import { PrismaService } from "../src/modules/database/prisma.service";

describe("Phase 2 Backend — Prisma Service Foundation", () => {
  test("instantiates PrismaService without errors", () => {
    const prisma = new PrismaService();
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.account).toBe("object");
    expect(typeof prisma.message).toBe("object");
    expect(typeof prisma.conversation).toBe("object");
  });
});
