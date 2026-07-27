import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { UsersModule } from "../src/modules/users/users.module";
import { ContactsModule } from "../src/modules/contacts/contacts.module";
import { PrivacyModule } from "../src/modules/privacy/privacy.module";
import { PrismaService } from "../src/modules/database/prisma.service";

describe("Phase 4 Backend — User Profile, Contacts, and Privacy Integration Test", () => {
  let app: NestFastifyApplication;

  const mockUser = {
    id: "user_me_123",
    publicId: "pub_123",
    phoneNumber: "+19876543210",
    displayName: "Alice Smith",
    about: "Available",
    avatarUrl: null,
    role: "USER",
    createdAt: new Date(),
    privacySettings: {
      lastSeenVisibility: "everyone",
      readReceipts: true
    }
  };

  const mockPrisma = {
    account: {
      findUnique: async () => mockUser,
      update: async (args: any) => ({
        ...mockUser,
        ...args.data
      }),
      findFirst: async () => ({
        id: "user_bob_456",
        phoneNumber: "+1112223333",
        displayName: "Bob Miller"
      })
    },
    contact: {
      findMany: async () => [
        {
          id: "c1",
          contactId: "user_bob_456",
          aliasName: "Bob",
          contactUser: {
            displayName: "Bob Miller",
            phoneNumber: "+1112223333",
            email: null,
            avatarUrl: null,
            about: "Hey there!"
          }
        }
      ],
      upsert: async () => ({
        id: "c2",
        contactId: "user_bob_456",
        aliasName: "Bob",
        contactUser: { displayName: "Bob Miller", phoneNumber: "+1112223333" }
      }),
      deleteMany: async () => ({ count: 1 })
    },
    privacySettings: {
      findUnique: async () => ({
        id: "p1",
        accountId: "user_me_123",
        lastSeenVisibility: "everyone",
        profilePhoto: "everyone",
        aboutVisibility: "everyone",
        statusVisibility: "contacts",
        readReceipts: true
      }),
      upsert: async (args: any) => ({
        id: "p1",
        accountId: "user_me_123",
        ...args.create,
        ...args.update
      })
    },
    block: {
      findMany: async () => [],
      upsert: async () => ({ id: "b1" }),
      deleteMany: async () => ({ count: 1 })
    }
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, ContactsModule, PrivacyModule]
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
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

  const validBearerToken = Buffer.from(
    JSON.stringify({ sub: "user_me_123", deviceId: "dev_1", exp: Math.floor(Date.now() / 1000) + 3600 })
  ).toString("base64url");

  test("GET /api/v1/users/me returns authenticated profile", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/users/me",
      headers: { authorization: `Bearer ${validBearerToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.id).toBe("user_me_123");
    expect(body.displayName).toBe("Alice Smith");
  });

  test("PATCH /api/v1/users/me updates display name and about status", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: "/users/me",
      headers: { authorization: `Bearer ${validBearerToken}` },
      payload: { displayName: "Alice S.", about: "Busy with ConnectChat" }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.displayName).toBe("Alice S.");
    expect(body.about).toBe("Busy with ConnectChat");
  });

  test("GET /api/v1/contacts retrieves contact list", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/contacts",
      headers: { authorization: `Bearer ${validBearerToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.length).toBe(1);
    expect(body[0].name).toBe("Bob");
  });

  test("GET /api/v1/privacy retrieves user privacy configuration", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/privacy",
      headers: { authorization: `Bearer ${validBearerToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.readReceipts).toBe(true);
    expect(body.lastSeenVisibility).toBe("everyone");
  });
});
