import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdatePrivacyDto, BlockUserDto } from "./dto/privacy.dto";

@Injectable()
export class PrivacyService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getPrivacySettings(accountId: string) {
    let privacy = await this.prisma.privacySettings.findUnique({
      where: { accountId }
    });

    if (!privacy) {
      privacy = await this.prisma.privacySettings.create({
        data: { accountId }
      });
    }

    return privacy;
  }

  async updatePrivacySettings(accountId: string, dto: UpdatePrivacyDto) {
    return await this.prisma.privacySettings.upsert({
      where: { accountId },
      update: dto,
      create: { accountId, ...dto }
    });
  }

  async getBlockedUsers(blockerId: string) {
    const blocks = await this.prisma.block.findMany({
      where: { blockerId },
      include: { target: true }
    });

    return blocks.map((b) => ({
      id: b.id,
      targetId: b.targetId,
      name: b.target.displayName,
      phone: b.target.phoneNumber,
      createdAt: b.createdAt
    }));
  }

  async blockUser(blockerId: string, dto: BlockUserDto) {
    if (blockerId === dto.targetId) {
      throw new BadRequestException("Cannot block yourself");
    }

    const block = await this.prisma.block.upsert({
      where: {
        blockerId_targetId: {
          blockerId,
          targetId: dto.targetId
        }
      },
      update: {},
      create: {
        blockerId,
        targetId: dto.targetId
      }
    });

    return { success: true, blockId: block.id };
  }

  async unblockUser(blockerId: string, targetId: string) {
    await this.prisma.block.deleteMany({
      where: { blockerId, targetId }
    });

    return { success: true, message: "User unblocked" };
  }
}
