import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ConnectionStatus = "none" | "pending" | "connected";

interface ConnectionsContextType {
  getStatus: (profileId: string) => ConnectionStatus;
  toggleConnection: (profileId: string) => void;
}

const ConnectionsContext = createContext<ConnectionsContextType | null>(null);

const STORAGE_KEY = "linkberry_connections_v1";

function loadConnections(): Record<string, ConnectionStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveConnections(data: Record<string, ConnectionStatus>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<Record<string, ConnectionStatus>>(loadConnections);

  const getStatus = useCallback(
    (profileId: string): ConnectionStatus => connections[profileId] || "none",
    [connections]
  );

  const toggleConnection = useCallback((profileId: string) => {
    setConnections((prev) => {
      const current = prev[profileId] || "none";
      const next = current === "none" ? "pending" : current === "pending" ? "none" : prev[profileId];
      const updated = { ...prev, [profileId]: next };
      saveConnections(updated);
      return updated;
    });
  }, []);

  return (
    <ConnectionsContext.Provider value={{ getStatus, toggleConnection }}>
      {children}
    </ConnectionsContext.Provider>
  );
}

export function useConnections() {
  const ctx = useContext(ConnectionsContext);
  if (!ctx) throw new Error("useConnections must be used within ConnectionsProvider");
  return ctx;
}
