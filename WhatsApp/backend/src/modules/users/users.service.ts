import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getProfile(accountId: string) {
    const user = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { privacySettings: true }
    });

    if (!user) {
      throw new NotFoundException("User profile not found");
    }

    return {
      id: user.id,
      publicId: user.publicId,
      phoneNumber: user.phoneNumber,
      email: user.email,
      displayName: user.displayName,
      about: user.about,
      avatarUrl: user.avatarUrl,
      role: user.role,
      privacySettings: user.privacySettings,
      createdAt: user.createdAt
    };
  }

  async updateProfile(accountId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.account.update({
      where: { id: accountId },
      data: {
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.about !== undefined && { about: dto.about }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl })
      }
    });

    return {
      id: updated.id,
      displayName: updated.displayName,
      about: updated.about,
      avatarUrl: updated.avatarUrl,
      updatedAt: updated.updatedAt
    };
  }
}
