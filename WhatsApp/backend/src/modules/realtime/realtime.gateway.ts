import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Inject, Logger } from "@nestjs/common";
import { PresenceService } from "./presence.service";
import { TypingService } from "./typing.service";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true
  },
  namespace: "/realtime"
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger("RealtimeGateway");

  constructor(
    @Inject(PresenceService) private readonly presenceService: PresenceService,
    @Inject(TypingService) private readonly typingService: TypingService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.auth?.token || client.handshake.headers?.authorization;
      if (!authHeader) {
        client.disconnect(true);
        return;
      }

      const token = authHeader.replace("Bearer ", "");
      const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));

      if (!payload.sub || !payload.deviceId) {
        client.disconnect(true);
        return;
      }

      client.data.accountId = payload.sub;
      client.data.deviceId = payload.deviceId;

      // Join user room
      client.join(`user:${payload.sub}`);

      // Set online in presence service
      await this.presenceService.setOnline(payload.sub, payload.deviceId);
      this.server.emit("presence:update", { accountId: payload.sub, isOnline: true });

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch (err) {
      this.logger.error(`Handshake auth failed for client ${client.id}`, err);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    const accountId = client.data?.accountId;
    if (accountId) {
      const state = await this.presenceService.setOffline(accountId);
      this.server.emit("presence:update", state);
      this.logger.log(`Client disconnected: ${client.id} (user: ${accountId})`);
    }
  }

  @SubscribeMessage("presence:heartbeat")
  async handleHeartbeat(@ConnectedSocket() client: Socket) {
    const accountId = client.data?.accountId;
    if (accountId) {
      await this.presenceService.refreshHeartbeat(accountId);
      return { status: "ack" };
    }
    return { status: "error" };
  }

  @SubscribeMessage("room:join")
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    if (data.conversationId) {
      client.join(`conversation:${data.conversationId}`);
      return { status: "joined", conversationId: data.conversationId };
    }
    return { status: "error" };
  }

  @SubscribeMessage("typing:start")
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string }
  ) {
    const accountId = client.data?.accountId;
    if (accountId && data.conversationId) {
      const typingState = await this.typingService.setTyping(data.conversationId, accountId, true);
      client.to(`conversation:${data.conversationId}`).emit("typing:update", typingState);
      return { status: "ack" };
    }
    return { status: "error" };
  }

  @SubscribeMessage("typing:stop")
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string }
  ) {
    const accountId = client.data?.accountId;
    if (accountId && data.conversationId) {
      const typingState = await this.typingService.setTyping(data.conversationId, accountId, false);
      client.to(`conversation:${data.conversationId}`).emit("typing:update", typingState);
      return { status: "ack" };
    }
    return { status: "error" };
  }
}
