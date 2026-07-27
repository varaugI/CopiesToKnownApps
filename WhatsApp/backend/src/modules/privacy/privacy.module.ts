import { Module } from "@nestjs/common";
import { PrivacyService } from "./privacy.service";
import { PrivacyController } from "./privacy.controller";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PrivacyController],
  providers: [PrivacyService],
  exports: [PrivacyService]
})
export class PrivacyModule {}
