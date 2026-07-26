import { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createAdapter } from '@socket.io/redis-adapter';
import { getRedisClient, isRedisConnected } from '../../config/redis.js';
import { env } from '../../config/env.config.js';
import { activeWebsocketGauge } from '../observability/metrics.js';
import { logger } from '../logging/logger.js';

let io: SocketIOServer | null = null;

export interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: string;
      username: string;
      email: string;
      avatar?: string;
    };
  };
}

export const initSocketServer = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Horizontal Multi-Node Scaling via Socket.IO Redis Adapter
  if (isRedisConnected()) {
    const pubClient = getRedisClient();
    if (pubClient) {
      const subClient = pubClient.duplicate();
      io.adapter(createAdapter(pubClient, subClient));
      logger.info('🚀 Socket.IO Redis Adapter attached for horizontal multi-node scaling');
    }
  }

  // JWT Handshake Auth Middleware
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (token) {
        const decoded: any = jwt.verify(token, env.JWT_SECRET);
        socket.data.user = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          avatar: decoded.avatar
        };
      }
    } catch (e) {
      // Allow unauthenticated connection for read-only listeners
    }
    next();
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const username = socket.data.user?.username || 'anonymous';
    activeWebsocketGauge.inc();
    logger.info({ socketId: socket.id, username }, 'Client connected via Socket.IO');

    // Room Subscriptions
    socket.on('join_room', (room: string) => {
      if (typeof room === 'string' && room.trim()) {
        socket.join(room);
        logger.info({ socketId: socket.id, room }, `Socket joined room: ${room}`);
      }
    });

    socket.on('leave_room', (room: string) => {
      if (typeof room === 'string' && room.trim()) {
        socket.leave(room);
        logger.info({ socketId: socket.id, room }, `Socket left room: ${room}`);
      }
    });

    // Real-Time Community Chat
    socket.on('send_chat_message', (payload: { room: string; content: string }) => {
      if (!socket.data.user) {
        socket.emit('error_message', { message: 'Authentication required to send chat messages' });
        return;
      }

      const { room, content } = payload || {};
      if (!room || !content || !content.trim()) return;

      const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        room,
        sender: socket.data.user,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };

      io?.to(room).emit('new_chat_message', messageData);
    });

    // Typing Indicators
    socket.on('typing_indicator', (payload: { room: string; isTyping: boolean }) => {
      if (!socket.data.user || !payload?.room) return;
      socket.to(payload.room).emit('user_typing', {
        username: socket.data.user.username,
        isTyping: !!payload.isTyping
      });
    });

    socket.on('disconnect', (reason) => {
      activeWebsocketGauge.dec();
      logger.info({ socketId: socket.id, username, reason }, 'Client disconnected from Socket.IO');
    });
  });

  return io;
};

export const getIO = (): SocketIOServer | null => io;
