import { Controller, Get, Patch, Body, UseGuards, Req, Inject } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Get("me")
  async getMyProfile(@Req() req: any) {
    return await this.usersService.getProfile(req.user.sub);
  }

  @Patch("me")
  async updateMyProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return await this.usersService.updateProfile(req.user.sub, dto);
  }
}
