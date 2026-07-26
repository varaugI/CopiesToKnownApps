import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getMemoryAccessToken } from '../services/api';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getMemoryAccessToken();
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (room) => {
    if (socket && room) {
      socket.emit('join_room', room);
    }
  };

  const leaveRoom = (room) => {
    if (socket && room) {
      socket.emit('leave_room', room);
    }
  };

  const sendChatMessage = (room, content) => {
    if (socket && room && content) {
      socket.emit('send_chat_message', { room, content });
    }
  };

  const sendTypingIndicator = (room, isTyping) => {
    if (socket && room) {
      socket.emit('typing_indicator', { room, isTyping });
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      joinRoom,
      leaveRoom,
      sendChatMessage,
      sendTypingIndicator
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
