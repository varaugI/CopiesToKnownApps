import { Injectable, UnauthorizedException, BadRequestException, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../database/prisma.service";
import { RequestOtpDto, VerifyOtpDto } from "./dto/auth.dto";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    publicId: string;
    phoneNumber?: string | null;
    email?: string | null;
    displayName: string;
  };
  deviceId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  private hashValue(val: string): string {
    return createHash("sha256").update(val).digest("hex");
  }

  async requestOtp(dto: RequestOtpDto): Promise<{ message: string; challengeId: string; demoCode?: string }> {
    const code = "123456"; // Fixed code for deterministic learning simulation
    const codeHash = this.hashValue(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const challenge = await this.prisma.verificationChallenge.create({
      data: {
        target: dto.target,
        codeHash,
        expiresAt
      }
    });

    return {
      message: "OTP challenge sent successfully",
      challengeId: challenge.id,
      demoCode: code
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthTokens> {
    const codeHash = this.hashValue(dto.code);

    const challenge = await this.prisma.verificationChallenge.findFirst({
      where: {
        target: dto.target,
        expiresAt: { gt: new Date() },
        isVerified: false
      },
      orderBy: { createdAt: "desc" }
    });

    if (!challenge) {
      throw new BadRequestException("Verification code expired or not found");
    }

    if (challenge.codeHash !== codeHash) {
      await this.prisma.verificationChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } }
      });
      throw new UnauthorizedException("Invalid verification code");
    }

    await this.prisma.verificationChallenge.update({
      where: { id: challenge.id },
      data: { isVerified: true }
    });

    // Create or locate account
    let account = await this.prisma.account.findFirst({
      where: { OR: [{ phoneNumber: dto.target }, { email: dto.target }] }
    });

    if (!account) {
      const isEmail = dto.target.includes("@");
      account = await this.prisma.account.create({
        data: {
          phoneNumber: isEmail ? null : dto.target,
          email: isEmail ? dto.target : null,
          displayName: dto.displayName || dto.target.split("@")[0],
          privacySettings: { create: {} }
        }
      });
    }

    // Register or locate device
    let device = await this.prisma.device.findFirst({
      where: { accountId: account.id, deviceName: dto.deviceName }
    });

    if (!device) {
      device = await this.prisma.device.create({
        data: {
          accountId: account.id,
          deviceName: dto.deviceName
        }
      });
    } else {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { lastActive: new Date() }
      });
    }

    // Generate tokens & store session
    const tokens = await this.generateTokens(account.id, device.id);

    return {
      ...tokens,
      user: {
        id: account.id,
        publicId: account.publicId,
        phoneNumber: account.phoneNumber,
        email: account.email,
        displayName: account.displayName
      },
      deviceId: device.id
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = this.hashValue(refreshToken);

    const session = await this.prisma.refreshSession.findUnique({
      where: { tokenHash },
      include: { account: true, device: true }
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    // Revoke old token & issue new rotated tokens
    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { isRevoked: true }
    });

    const tokens = await this.generateTokens(session.accountId, session.deviceId);

    return {
      ...tokens,
      user: {
        id: session.account.id,
        publicId: session.account.publicId,
        phoneNumber: session.account.phoneNumber,
        email: session.account.email,
        displayName: session.account.displayName
      },
      deviceId: session.deviceId
    };
  }

  async logout(refreshToken: string): Promise<{ success: boolean }> {
    const tokenHash = this.hashValue(refreshToken);

    await this.prisma.refreshSession.updateMany({
      where: { tokenHash },
      data: { isRevoked: true }
    });

    return { success: true };
  }

  private async generateTokens(accountId: string, deviceId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = Buffer.from(
      JSON.stringify({ sub: accountId, deviceId, exp: Math.floor(Date.now() / 1000) + 3600 })
    ).toString("base64url");

    const rawRefreshToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashValue(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await this.prisma.refreshSession.create({
      data: {
        accountId,
        deviceId,
        tokenHash,
        expiresAt
      }
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken
    };
  }
}
