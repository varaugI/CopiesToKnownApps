import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

export interface TypingEvent {
  conversationId: string;
  accountId: string;
  isTyping: boolean;
}

@Injectable()
export class TypingService {
  constructor(@Inject(RedisService) private readonly redisService: RedisService) {}

  async setTyping(conversationId: string, accountId: string, isTyping: boolean): Promise<TypingEvent> {
    const key = `typing:${conversationId}:${accountId}`;

    if (isTyping) {
      await this.redisService.set(key, "1", 5); // 5s auto expire
    } else {
      await this.redisService.del(key);
    }

    return {
      conversationId,
      accountId,
      isTyping
    };
  }
}
