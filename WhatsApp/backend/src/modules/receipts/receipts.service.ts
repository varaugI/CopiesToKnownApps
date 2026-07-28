import {
  Injectable,
  ForbiddenException,
  Inject
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { UpdateReceiptDto } from "./dto/receipt.dto";

@Injectable()
export class ReceiptsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RealtimeGateway) private readonly realtimeGateway: RealtimeGateway
  ) {}

  async updateReceipts(
    conversationId: string,
    accountId: string,
    deviceId: string,
    dto: UpdateReceiptDto
  ) {
    // 1. Verify membership
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_accountId: { conversationId, accountId } }
    });

    if (!member) {
      throw new ForbiddenException("Not a member of this conversation");
    }

    // 2. Check user's privacy settings for read receipts
    const privacy = await this.prisma.privacySettings.findUnique({
      where: { accountId }
    });

    const isReadState = dto.state === "READ";
    const allowReadReceipt = privacy ? privacy.readReceipts : true;

    // Suppress READ emission if user disabled read receipts
    const effectiveState = isReadState && !allowReadReceipt ? "DELIVERED" : dto.state;

    // 3. Upsert MessageReceipt records
    const updatedReceipts = await Promise.all(
      dto.messageIds.map(async (messageId) => {
        return await this.prisma.messageReceipt.upsert({
          where: {
            messageId_accountId_state: {
              messageId,
              accountId,
              state: effectiveState
            }
          },
          update: { updatedAt: new Date() },
          create: {
            messageId,
            accountId,
            deviceId,
            state: effectiveState
          }
        });
      })
    );

    // 4. Emit realtime receipt update socket event
    const eventPayload = {
      conversationId,
      accountId,
      messageIds: dto.messageIds,
      state: effectiveState,
      updatedAt: new Date().toISOString()
    };

    this.realtimeGateway.server
      .to(`conversation:${conversationId}`)
      .emit("receipt:update", eventPayload);

    return {
      success: true,
      updatedCount: updatedReceipts.length,
      state: effectiveState,
      readReceiptSuppressed: isReadState && !allowReadReceipt
    };
  }

  async markConversationAsRead(conversationId: string, accountId: string) {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_accountId: { conversationId, accountId } }
    });

    if (!member) {
      throw new ForbiddenException("Not a member of this conversation");
    }

    // Retrieve unread messages for this user in the conversation
    const unreadMessages = await this.prisma.message.findMany({
      where: {
        conversationId,
        senderId: { not: accountId }
      },
      select: { id: true },
      take: 100
    });

    const messageIds = unreadMessages.map((m) => m.id);

    if (messageIds.length > 0) {
      await this.updateReceipts(conversationId, accountId, "device_active", {
        messageIds,
        state: "READ"
      });
    }

    return {
      success: true,
      conversationId,
      unreadClearedCount: messageIds.length
    };
  }
}
