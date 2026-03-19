import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CalendarBlockData } from "../pages/Calendar";

export interface RegisteredEvent {
  id: string;
  eventId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: string;
  description: string;
  image: string;
  registeredAt: number;
}

interface CalendarEventsContextType {
  blocks: CalendarBlockData[];
  addBlocks: (newBlocks: CalendarBlockData[]) => void;
  addBlock: (newBlock: CalendarBlockData) => void;
  updateBlock: (id: string, updatedBlock: Partial<CalendarBlockData>) => void;
  removeBlock: (id: string) => void;
  registeredEvents: RegisteredEvent[];
  registerForEvent: (event: RegisteredEvent) => void;
  isEventRegistered: (eventId: string) => boolean;
}

const CalendarEventsContext = createContext<CalendarEventsContextType | undefined>(undefined);

const STORAGE_VERSION = "v6"; // Bump this to clear old data (v6: updated to 2026 event dates)

export function CalendarEventsProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<CalendarBlockData[]>(() => {
    const version = localStorage.getItem("calendarStorageVersion");
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem("calendarBlocks");
      localStorage.removeItem("registeredEvents");
      localStorage.setItem("calendarStorageVersion", STORAGE_VERSION);
      return [];
    }
    const stored = localStorage.getItem("calendarBlocks");
    return stored ? JSON.parse(stored) : [];
  });

  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>(() => {
    const version = localStorage.getItem("calendarStorageVersion");
    if (version !== STORAGE_VERSION) return [];
    const stored = localStorage.getItem("registeredEvents");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever blocks change
  useEffect(() => {
    localStorage.setItem("calendarBlocks", JSON.stringify(blocks));
  }, [blocks]);

  // Save registered events to localStorage
  useEffect(() => {
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
  }, [registeredEvents]);

  const addBlocks = (newBlocks: CalendarBlockData[]) => {
    setBlocks((prev) => [...prev, ...newBlocks]);
  };

  const addBlock = (newBlock: CalendarBlockData) => {
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, updatedBlock: Partial<CalendarBlockData>) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updatedBlock } : block))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const registerForEvent = (event: RegisteredEvent) => {
    setRegisteredEvents((prev) => {
      if (prev.some((e) => e.eventId === event.eventId)) return prev;
      return [...prev, event];
    });
  };

  const isEventRegistered = (eventId: string) => {
    return registeredEvents.some((e) => e.eventId === eventId);
  };

  return (
    <CalendarEventsContext.Provider
      value={{
        blocks,
        addBlocks,
        addBlock,
        updateBlock,
        removeBlock,
        registeredEvents,
        registerForEvent,
        isEventRegistered,
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
}

export function useCalendarEvents() {
  const context = useContext(CalendarEventsContext);
  if (context === undefined) {
    throw new Error("useCalendarEvents must be used within a CalendarEventsProvider");
  }
  return context;
}