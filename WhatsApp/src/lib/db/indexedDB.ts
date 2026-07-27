import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Message, ChatConversation } from "../../types";

interface ConnectChatDBSchema extends DBSchema {
  conversations: {
    key: string;
    value: ChatConversation;
  };
  messages: {
    key: string;
    value: Message;
    indexes: { "by-conversation": string };
  };
  outboundQueue: {
    key: string;
    value: {
      id: string;
      clientMessageId: string;
      conversationId: string;
      message: Message;
      createdAt: number;
    };
  };
}

const DB_NAME = "connectchat_local_db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ConnectChatDBSchema>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<ConnectChatDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("conversations")) {
          db.createObjectStore("conversations", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("messages")) {
          const messageStore = db.createObjectStore("messages", { keyPath: "id" });
          messageStore.createIndex("by-conversation", "conversationId");
        }
        if (!db.objectStoreNames.contains("outboundQueue")) {
          db.createObjectStore("outboundQueue", { keyPath: "id" });
        }
      }
    });
  }
  return dbPromise;
};

export const saveConversationLocal = async (conversation: ChatConversation): Promise<void> => {
  const db = await getDB();
  await db.put("conversations", conversation);
};

export const getConversationsLocal = async (): Promise<ChatConversation[]> => {
  const db = await getDB();
  return db.getAll("conversations");
};

export const saveMessageLocal = async (message: Message): Promise<void> => {
  const db = await getDB();
  await db.put("messages", message);
};

export const getMessagesByConversationLocal = async (conversationId: string): Promise<Message[]> => {
  const db = await getDB();
  return db.getAllFromIndex("messages", "by-conversation", conversationId);
};

export const enqueueOutboundMessage = async (
  clientMessageId: string,
  conversationId: string,
  message: Message
): Promise<void> => {
  const db = await getDB();
  await db.put("outboundQueue", {
    id: clientMessageId,
    clientMessageId,
    conversationId,
    message,
    createdAt: Date.now()
  });
};

export const getOutboundQueue = async () => {
  const db = await getDB();
  return db.getAll("outboundQueue");
};

export const dequeueOutboundMessage = async (clientMessageId: string): Promise<void> => {
  const db = await getDB();
  await db.delete("outboundQueue", clientMessageId);
};
