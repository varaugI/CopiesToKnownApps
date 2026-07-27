import { Module } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import { PresenceService } from "./presence.service";
import { TypingService } from "./typing.service";
import { DatabaseModule } from "../database/database.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [RealtimeGateway, PresenceService, TypingService],
  exports: [RealtimeGateway, PresenceService, TypingService]
})
export class RealtimeModule {}
