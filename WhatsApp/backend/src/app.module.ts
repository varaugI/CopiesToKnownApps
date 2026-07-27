import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateConfig } from "./config/config.schema";
import { DatabaseModule } from "./modules/database/database.module";
import { RedisModule } from "./modules/redis/redis.module";
import { HealthModule } from "./modules/health/health.module";
import { MetricsModule } from "./modules/metrics/metrics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DevicesModule } from "./modules/devices/devices.module";
import { UsersModule } from "./modules/users/users.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { PrivacyModule } from "./modules/privacy/privacy.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { ConversationsModule } from "./modules/conversations/conversations.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig
    }),
    DatabaseModule,
    RedisModule,
    HealthModule,
    MetricsModule,
    AuthModule,
    DevicesModule,
    UsersModule,
    ContactsModule,
    PrivacyModule,
    RealtimeModule,
    ConversationsModule
  ]
})
export class AppModule {}
