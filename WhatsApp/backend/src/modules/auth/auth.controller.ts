import { Controller, Post, Body, Res, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { AuthService } from "./auth.service";
import { RequestOtpDto, VerifyOtpDto, RefreshTokenDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("request-otp")
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() dto: RequestOtpDto) {
    return await this.authService.requestOtp(dto);
  }

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: FastifyReply) {
    const result = await this.authService.verifyOtp(dto);

    res.header(
      "Set-Cookie",
      `connectchat_rt=${result.refreshToken}; HttpOnly; Path=/api/v1/auth; SameSite=Strict; Max-Age=${
        30 * 24 * 60 * 60
      }`
    );

    return result;
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: FastifyReply) {
    const result = await this.authService.refreshToken(dto.refreshToken);

    res.header(
      "Set-Cookie",
      `connectchat_rt=${result.refreshToken}; HttpOnly; Path=/api/v1/auth; SameSite=Strict; Max-Age=${
        30 * 24 * 60 * 60
      }`
    );

    return result;
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: FastifyReply) {
    res.header("Set-Cookie", "connectchat_rt=; HttpOnly; Path=/api/v1/auth; Max-Age=0");
    return await this.authService.logout(dto.refreshToken);
  }
}
