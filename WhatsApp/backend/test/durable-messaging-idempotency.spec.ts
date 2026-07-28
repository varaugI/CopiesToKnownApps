import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { ConversationsModule } from "../src/modules/conversations/conversations.module";
import { PrismaService } from "../src/modules/database/prisma.service";
import { RealtimeGateway } from "../src/modules/realtime/realtime.gateway";
import { RedisService } from "../src/modules/redis/redis.service";

describe("Phase 6 Backend — Durable Messaging & Idempotency Integration Test", () => {
  let app: NestFastifyApplication;

  const mockMessagesMap = new Map<string, any>();
  let currentSequence = 100n;

  const mockPrisma = {
    conversationMember: {
      findUnique: async (args: any) => ({
        id: "mem_1",
        conversationId: args.where.conversationId_accountId.conversationId,
        accountId: args.where.conversationId_accountId.accountId,
        role: "member"
      }),
      findMany: async () => []
    },
    directConversationPair: {
      findUnique: async () => null
    },
    conversation: {
      create: async () => ({ id: "conv_test_100", isGroup: false, lastSequence: 0n }),
      update: async () => {
        currentSequence += 1n;
        return { id: "conv_test_100", lastSequence: currentSequence };
      }
    },
    message: {
      findUnique: async (args: any) => {
        const key = `${args.where.senderId_clientMessageId.senderId}_${args.where.senderId_clientMessageId.clientMessageId}`;
        return mockMessagesMap.get(key) || null;
      },
      create: async (args: any) => {
        const key = `${args.data.senderId}_${args.data.clientMessageId}`;
        const msg = {
          id: `msg_db_${Date.now()}`,
          clientMessageId: args.data.clientMessageId,
          conversationId: args.data.conversationId,
          senderId: args.data.senderId,
          sequenceNumber: args.data.sequenceNumber,
          type: args.data.type,
          createdAt: new Date(),
          textPayload: { body: args.data.textPayload.create.body },
          sender: { displayName: "Alice Smith" }
        };
        mockMessagesMap.set(key, msg);
        return msg;
      },
      findMany: async (args: any) => {
        return Array.from(mockMessagesMap.values()).filter(
          (m) => m.conversationId === args.where.conversationId
        );
      }
    },
    outboxEvent: {
      create: async () => ({})
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
      imports: [ConversationsModule]
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
    JSON.stringify({ sub: "user_sender_1", deviceId: "dev_1", exp: Math.floor(Date.now() / 1000) + 3600 })
  ).toString("base64url");

  test("POST /api/v1/conversations/:id/messages creates durable message with sequence number", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/conversations/conv_test_100/messages",
      headers: { authorization: `Bearer ${bearerToken}` },
      payload: {
        clientMessageId: "client_msg_uuid_100",
        text: "Hello from durable messaging test"
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.clientMessageId).toBe("client_msg_uuid_100");
    expect(body.sequenceNumber).toBe(101);
    expect(body.isDuplicate).toBe(false);
  });

  test("POST /api/v1/conversations/:id/messages enforces strict clientMessageId idempotency", async () => {
    // Retry exact same payload with same clientMessageId
    const res = await app.inject({
      method: "POST",
      url: "/conversations/conv_test_100/messages",
      headers: { authorization: `Bearer ${bearerToken}` },
      payload: {
        clientMessageId: "client_msg_uuid_100",
        text: "Hello from durable messaging test"
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.clientMessageId).toBe("client_msg_uuid_100");
    expect(body.isDuplicate).toBe(true);
  });

  test("GET /api/v1/conversations/:id/messages returns bounded message list", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/conversations/conv_test_100/messages?limit=10",
      headers: { authorization: `Bearer ${bearerToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0].clientMessageId).toBe("client_msg_uuid_100");
  });
});
