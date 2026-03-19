import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

export interface Chat {
  id: string;
  personId: string;
  personName: string;
  personImage: string;
  personTitle: string;
  personCompany: string;
  messages: ChatMessage[];
  lastActivity: number;
}

interface ChatsContextType {
  chats: Chat[];
  createChat: (person: { id: string; name: string; imageUrl: string; title: string; company: string }) => string;
  sendMessage: (chatId: string, text: string) => void;
  getChat: (chatId: string) => Chat | undefined;
  getChatByPersonId: (personId: string) => Chat | undefined;
  deleteChat: (chatId: string) => void;
}

const ChatsContext = createContext<ChatsContextType | null>(null);

const STORAGE_KEY = "linkberry_chats_v1";

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveChats(chats: Chat[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {}
}

// Mock auto-replies for a more lively feel
const AUTO_REPLIES = [
  "Hey! Great to hear from you. Let's definitely catch up soon.",
  "Thanks for reaching out! I've been meaning to connect.",
  "Sounds great! Are you going to the summit next week?",
  "Absolutely, let's find some time this week to chat.",
  "Love that idea! I'll send you some details.",
  "Perfect timing — I was just thinking about this topic.",
  "Thanks! Looking forward to connecting more.",
  "That's awesome, let me know how I can help!",
];

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(loadChats);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  const createChat = useCallback((person: { id: string; name: string; imageUrl: string; title: string; company: string }): string => {
    // Check if chat already exists
    const existing = chats.find(c => c.personId === person.id);
    if (existing) return existing.id;

    const chatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: chatId,
      personId: person.id,
      personName: person.name,
      personImage: person.imageUrl,
      personTitle: person.title,
      personCompany: person.company,
      messages: [],
      lastActivity: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    return chatId;
  }, [chats]);

  const sendMessage = useCallback((chatId: string, text: string) => {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      text,
      fromMe: true,
      timestamp: Date.now(),
    };
    setChats(prev => {
      const updated = prev.map(chat => {
        if (chat.id !== chatId) return chat;
        return { ...chat, messages: [...chat.messages, msg], lastActivity: Date.now() };
      });
      saveChats(updated);
      return updated;
    });

    // Auto-reply after a short delay
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg_${Date.now()}_reply`,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        fromMe: false,
        timestamp: Date.now(),
      };
      setChats(prev => {
        const updated = prev.map(chat => {
          if (chat.id !== chatId) return chat;
          return { ...chat, messages: [...chat.messages, reply], lastActivity: Date.now() };
        });
        saveChats(updated);
        return updated;
      });
    }, 1200 + Math.random() * 2000);
  }, []);

  const getChat = useCallback((chatId: string) => chats.find(c => c.id === chatId), [chats]);
  const getChatByPersonId = useCallback((personId: string) => chats.find(c => c.personId === personId), [chats]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
  }, []);

  return (
    <ChatsContext.Provider value={{ chats, createChat, sendMessage, getChat, getChatByPersonId, deleteChat }}>
      {children}
    </ChatsContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used within ChatsProvider");
  return ctx;
}
