import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Inject
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateConversationDto, SendMessageDto, GetMessagesQueryDto } from "./dto/conversation.dto";

@Injectable()
export class ConversationsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RealtimeGateway) private readonly realtimeGateway: RealtimeGateway
  ) {}

  async getConversations(accountId: string) {
    const memberships = await this.prisma.conversationMember.findMany({
      where: { accountId },
      include: {
        conversation: {
          include: {
            members: {
              include: { account: true }
            },
            messages: {
              take: 1,
              orderBy: { sequenceNumber: "desc" },
              include: { textPayload: true, sender: true }
            }
          }
        }
      },
      orderBy: { conversation: { updatedAt: "desc" } }
    });

    return memberships.map((m) => {
      const conv = m.conversation;
      const otherMember = conv.members.find((mem) => mem.accountId !== accountId)?.account;
      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        title: conv.isGroup ? conv.title : otherMember?.displayName || "Chat",
        avatarUrl: conv.isGroup ? conv.avatarUrl : otherMember?.avatarUrl,
        lastSequence: Number(conv.lastSequence),
        updatedAt: conv.updatedAt,
        contact: otherMember
          ? {
              id: otherMember.id,
              name: otherMember.displayName,
              avatar: otherMember.avatarUrl,
              phone: otherMember.phoneNumber
            }
          : null,
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              clientMessageId: lastMsg.clientMessageId,
              senderId: lastMsg.senderId,
              senderName: lastMsg.sender.displayName,
              text: lastMsg.textPayload?.body || "",
              sequenceNumber: Number(lastMsg.sequenceNumber),
              createdAt: lastMsg.createdAt
            }
          : null
      };
    });
  }

  async createConversation(creatorId: string, dto: CreateConversationDto) {
    if (!dto.isGroup && dto.recipientIds.length === 1) {
      const recipientId = dto.recipientIds[0];
      const [userA, userB] = [creatorId, recipientId].sort();

      const existingPair = await this.prisma.directConversationPair.findUnique({
        where: { userAId_userBId: { userAId: userA, userBId: userB } },
        include: { conversation: true }
      });

      if (existingPair) {
        return existingPair.conversation;
      }

      const newConv = await this.prisma.conversation.create({
        data: {
          isGroup: false,
          directPair: {
            create: { userAId: userA, userBId: userB }
          },
          members: {
            createMany: {
              data: [
                { accountId: creatorId, role: "owner" },
                { accountId: recipientId, role: "member" }
              ]
            }
          }
        }
      });

      return newConv;
    }

    // Group conversation
    const allMembers = Array.from(new Set([creatorId, ...dto.recipientIds]));
    const groupConv = await this.prisma.conversation.create({
      data: {
        isGroup: true,
        title: dto.title || "New Group",
        members: {
          createMany: {
            data: allMembers.map((id) => ({
              accountId: id,
              role: id === creatorId ? "admin" : "member"
            }))
          }
        }
      }
    });

    return groupConv;
  }

  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {
    // 1. Verify membership
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_accountId: { conversationId, accountId: senderId } }
    });

    if (!member) {
      throw new ForbiddenException("Not a member of this conversation");
    }

    // 2. Idempotency Check
    const existingMsg = await this.prisma.message.findUnique({
      where: { senderId_clientMessageId: { senderId, clientMessageId: dto.clientMessageId } },
      include: { textPayload: true }
    });

    if (existingMsg) {
      return {
        id: existingMsg.id,
        clientMessageId: existingMsg.clientMessageId,
        conversationId: existingMsg.conversationId,
        senderId: existingMsg.senderId,
        sequenceNumber: Number(existingMsg.sequenceNumber),
        text: existingMsg.textPayload?.body || "",
        createdAt: existingMsg.createdAt,
        isDuplicate: true
      };
    }

    // 3. Atomically increment conversation lastSequence
    const updatedConv = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastSequence: { increment: 1 } }
    });

    const nextSequence = updatedConv.lastSequence;

    // 4. Create Message, Text Payload, Outbox Event
    const message = await this.prisma.message.create({
      data: {
        clientMessageId: dto.clientMessageId,
        conversationId,
        senderId,
        sequenceNumber: nextSequence,
        type: dto.type || "TEXT",
        textPayload: {
          create: { body: dto.text }
        }
      },
      include: { textPayload: true, sender: true }
    });

    await this.prisma.outboxEvent.create({
      data: {
        aggregateType: "Message",
        aggregateId: message.id,
        eventType: "MESSAGE_CREATED",
        payload: JSON.stringify({
          messageId: message.id,
          conversationId,
          senderId,
          sequenceNumber: Number(nextSequence),
          text: dto.text
        })
      }
    });

    const payload = {
      id: message.id,
      clientMessageId: message.clientMessageId,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.sender.displayName,
      sequenceNumber: Number(message.sequenceNumber),
      text: message.textPayload?.body || "",
      createdAt: message.createdAt,
      isDuplicate: false
    };

    // 5. Emit Realtime Socket Notification
    this.realtimeGateway.server
      .to(`conversation:${conversationId}`)
      .emit("message:new", payload);

    return payload;
  }

  async getMessages(conversationId: string, requesterId: string, query: GetMessagesQueryDto) {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_accountId: { conversationId, accountId: requesterId } }
    });

    if (!member) {
      throw new ForbiddenException("Not a member of this conversation");
    }

    const limit = query.limit || 50;
    const beforeSeq = query.beforeSequence;

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(beforeSeq && { sequenceNumber: { lt: BigInt(beforeSeq) } })
      },
      orderBy: { sequenceNumber: "desc" },
      take: limit,
      include: { textPayload: true, sender: true }
    });

    return messages.map((m) => ({
      id: m.id,
      clientMessageId: m.clientMessageId,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.sender.displayName,
      sequenceNumber: Number(m.sequenceNumber),
      type: m.type,
      text: m.textPayload?.body || "",
      createdAt: m.createdAt
    }));
  }
}
