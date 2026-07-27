import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { PrismaService } from "../database/prisma.service";

export interface PresenceState {
  accountId: string;
  isOnline: boolean;
  lastSeen: string;
}

@Injectable()
export class PresenceService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  async setOnline(accountId: string, deviceId: string): Promise<PresenceState> {
    const key = `presence:${accountId}`;
    const state: PresenceState = {
      accountId,
      isOnline: true,
      lastSeen: new Date().toISOString()
    };

    await this.redisService.set(key, JSON.stringify(state), 60);

    await this.prismaService.account.update({
      where: { id: accountId },
      data: { updatedAt: new Date() }
    });

    return state;
  }

  async setOffline(accountId: string): Promise<PresenceState> {
    const key = `presence:${accountId}`;
    const state: PresenceState = {
      accountId,
      isOnline: false,
      lastSeen: new Date().toISOString()
    };

    await this.redisService.set(key, JSON.stringify(state), 86400 * 7);
    return state;
  }

  async getPresence(accountId: string): Promise<PresenceState> {
    const key = `presence:${accountId}`;
    const raw = await this.redisService.get(key);

    if (raw) {
      try {
        return JSON.parse(raw) as PresenceState;
      } catch {
        // Fallback
      }
    }

    return {
      accountId,
      isOnline: false,
      lastSeen: new Date().toISOString()
    };
  }

  async refreshHeartbeat(accountId: string): Promise<void> {
    const key = `presence:${accountId}`;
    const state = await this.getPresence(accountId);
    state.isOnline = true;
    state.lastSeen = new Date().toISOString();
    await this.redisService.set(key, JSON.stringify(state), 60);
  }
}
