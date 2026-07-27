import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { AuthModule } from "../src/modules/auth/auth.module";
import { AuthService } from "../src/modules/auth/auth.service";
import { PrismaService } from "../src/modules/database/prisma.service";

describe("Phase 3 Backend — Auth & Devices Integration Test", () => {
  let app: NestFastifyApplication;
  let authService: AuthService;

  // Mock Prisma Service
  const mockPrisma = {
    verificationChallenge: {
      create: async (args: any) => ({
        id: "chal_123",
        target: args.data.target,
        codeHash: args.data.codeHash,
        expiresAt: args.data.expiresAt
      }),
      findFirst: async () => ({
        id: "chal_123",
        target: "+1234567890",
        codeHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // hash of 123456
        expiresAt: new Date(Date.now() + 300000),
        isVerified: false
      }),
      update: async () => ({})
    },
    account: {
      findFirst: async () => null,
      create: async (args: any) => ({
        id: "acc_test_1",
        publicId: "pub_acc_1",
        phoneNumber: args.data.phoneNumber,
        email: args.data.email,
        displayName: args.data.displayName
      })
    },
    device: {
      findFirst: async () => null,
      create: async (args: any) => ({
        id: "dev_test_1",
        accountId: args.data.accountId,
        deviceName: args.data.deviceName
      }),
      update: async () => ({})
    },
    refreshSession: {
      create: async () => ({}),
      findUnique: async () => null,
      update: async () => ({}),
      updateMany: async () => ({ count: 1 })
    }
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    authService = app.get(AuthService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  test("POST /api/v1/auth/request-otp generates verification challenge", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/request-otp",
      payload: { target: "+1234567890" }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.challengeId).toBe("chal_123");
    expect(body.demoCode).toBe("123456");
  });

  test("POST /api/v1/auth/verify-otp verifies code and issues tokens with HTTP-only cookie", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/verify-otp",
      payload: {
        target: "+1234567890",
        code: "123456",
        deviceName: "Test Web Client"
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(body.user.displayName).toBe("+1234567890");

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(String(setCookie)).toContain("connectchat_rt=");
  });
});
