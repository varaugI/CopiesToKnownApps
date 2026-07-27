import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Req, Inject } from "@nestjs/common";
import { PrivacyService } from "./privacy.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdatePrivacyDto, BlockUserDto } from "./dto/privacy.dto";

@Controller()
@UseGuards(JwtAuthGuard)
export class PrivacyController {
  constructor(@Inject(PrivacyService) private readonly privacyService: PrivacyService) {}

  @Get("privacy")
  async getPrivacy(@Req() req: any) {
    return await this.privacyService.getPrivacySettings(req.user.sub);
  }

  @Patch("privacy")
  async updatePrivacy(@Req() req: any, @Body() dto: UpdatePrivacyDto) {
    return await this.privacyService.updatePrivacySettings(req.user.sub, dto);
  }

  @Get("blocks")
  async getBlockedUsers(@Req() req: any) {
    return await this.privacyService.getBlockedUsers(req.user.sub);
  }

  @Post("blocks")
  async blockUser(@Req() req: any, @Body() dto: BlockUserDto) {
    return await this.privacyService.blockUser(req.user.sub, dto);
  }

  @Delete("blocks/:targetId")
  async unblockUser(@Req() req: any, @Param("targetId") targetId: string) {
    return await this.privacyService.unblockUser(req.user.sub, targetId);
  }
}
