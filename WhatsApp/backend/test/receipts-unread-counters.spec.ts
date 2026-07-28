import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ReceiptsModule } from "../src/modules/receipts/receipts.module";
import { PrismaService } from "../src/modules/database/prisma.service";
import { RealtimeGateway } from "../src/modules/realtime/realtime.gateway";
import { RedisService } from "../src/modules/redis/redis.service";

describe("Phase 7 Backend — Receipts & Unread Counters Integration Test", () => {
  let app: NestFastifyApplication;

  const mockReceipts = new Map<string, any>();

  const mockPrisma = {
    conversationMember: {
      findUnique: async () => ({
        id: "mem_1",
        conversationId: "conv_test_100",
        accountId: "user_reader_1",
        role: "member"
      })
    },
    privacySettings: {
      findUnique: async () => ({
        accountId: "user_reader_1",
        readReceipts: true
      })
    },
    messageReceipt: {
      upsert: async (args: any) => {
        const key = `${args.where.messageId_accountId_state.messageId}_${args.where.messageId_accountId_state.state}`;
        const record = {
          id: `rcpt_${Date.now()}`,
          messageId: args.create.messageId,
          accountId: args.create.accountId,
          state: args.create.state,
          updatedAt: new Date()
        };
        mockReceipts.set(key, record);
        return record;
      }
    },
    message: {
      findMany: async () => [
        { id: "msg_unread_1" },
        { id: "msg_unread_2" }
      ]
    }
  };

  const mockRealtimeGateway = {
    server: {
      to: () => ({
        emit: () => {}
      })
    }
  };

  const mockRedisService = {
    get: async () => null,
    set: async () => {},
    del: async () => {}
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ReceiptsModule]
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(RealtimeGateway)
      .useValue(mockRealtimeGateway)
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  const bearerToken = Buffer.from(
    JSON.stringify({ sub: "user_reader_1", deviceId: "dev_1", exp: Math.floor(Date.now() / 1000) + 3600 })
  ).toString("base64url");

  test("POST /api/v1/conversations/:id/receipts updates message state to READ", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/conversations/conv_test_100/receipts",
      headers: { authorization: `Bearer ${bearerToken}` },
      payload: {
        messageIds: ["msg_unread_1", "msg_unread_2"],
        state: "READ"
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.updatedCount).toBe(2);
    expect(body.state).toBe("READ");
    expect(body.readReceiptSuppressed).toBe(false);
  });

  test("PATCH /api/v1/conversations/:id/read clears unread messages for conversation", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: "/conversations/conv_test_100/read",
      headers: { authorization: `Bearer ${bearerToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.unreadClearedCount).toBe(2);
  });
});
