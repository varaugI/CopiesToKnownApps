import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { PresenceService } from "../src/modules/realtime/presence.service";
import { TypingService } from "../src/modules/realtime/typing.service";
import { RedisService } from "../src/modules/redis/redis.service";
import { PrismaService } from "../src/modules/database/prisma.service";

describe("Phase 5 Backend — Presence & Typing Realtime Logic", () => {
  let presenceService: PresenceService;
  let typingService: TypingService;

  const mockRedisStore = new Map<string, string>();

  const mockRedisService = {
    get: async (key: string) => mockRedisStore.get(key) || null,
    set: async (key: string, value: string) => {
      mockRedisStore.set(key, value);
    },
    del: async (key: string) => {
      mockRedisStore.delete(key);
    }
  };

  const mockPrismaService = {
    account: {
      update: async () => ({})
    }
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PresenceService,
        TypingService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PrismaService, useValue: mockPrismaService }
      ]
    }).compile();

    presenceService = moduleRef.get(PresenceService);
    typingService = moduleRef.get(TypingService);
  });

  test("setOnline stores online presence state in Redis", async () => {
    const state = await presenceService.setOnline("acc_user_1", "dev_1");
    expect(state.isOnline).toBe(true);
    expect(state.accountId).toBe("acc_user_1");

    const fetched = await presenceService.getPresence("acc_user_1");
    expect(fetched.isOnline).toBe(true);
  });

  test("setOffline updates presence state to offline", async () => {
    const state = await presenceService.setOffline("acc_user_1");
    expect(state.isOnline).toBe(false);

    const fetched = await presenceService.getPresence("acc_user_1");
    expect(fetched.isOnline).toBe(false);
  });

  test("setTyping manages ephemeral typing key state", async () => {
    const typingOn = await typingService.setTyping("chat_123", "acc_user_1", true);
    expect(typingOn.isTyping).toBe(true);
    expect(typingOn.conversationId).toBe("chat_123");

    const typingOff = await typingService.setTyping("chat_123", "acc_user_1", false);
    expect(typingOff.isTyping).toBe(false);
  });
});
