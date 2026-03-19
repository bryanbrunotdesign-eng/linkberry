import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, Plus, X, ChevronLeft, Send, MessageCircle } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useChats, Chat } from "../contexts/ChatsContext";
import { useConnections } from "../contexts/ConnectionsContext";
import { recommendedPeople, PersonItem } from "../data/events";

// ─── Helper: time ago ───
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── New Chat Sheet ───
function NewChatSheet({
  onClose,
  onSelectPerson,
}: {
  onClose: () => void;
  onSelectPerson: (person: PersonItem) => void;
}) {
  const [search, setSearch] = useState("");
  const { getStatus } = useConnections();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  // Show connections (pending or connected) + all recommended people
  const allPeople = recommendedPeople;
  const filtered = search.trim()
    ? allPeople.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.company.toLowerCase().includes(search.toLowerCase()) ||
          p.title.toLowerCase().includes(search.toLowerCase())
      )
    : allPeople;

  // Sort: connected first, then pending, then others
  const sorted = [...filtered].sort((a, b) => {
    const statusOrder = { connected: 0, pending: 1, none: 2 };
    return statusOrder[getStatus(a.id)] - statusOrder[getStatus(b.id)];
  });

  return (
    <div className="fixed inset-0 z-[70] flex flex-col">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mt-auto bg-white rounded-t-2xl max-h-[85%] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <h2 className="font-['Rethink_Sans',sans-serif] font-bold text-lg text-[#0D1117]">
            New Chat
          </h2>
          <button onClick={onClose} className="p-1 active:scale-95">
            <X className="w-5 h-5 text-[#0D1117]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-[#F7F8FA] rounded-xl px-3 py-2.5 border border-[#E2E8F0]">
            <Search className="w-4 h-4 text-[#A0AEC0] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name, company, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-0.5">
                <X className="w-3.5 h-3.5 text-[#A0AEC0]" />
              </button>
            )}
          </div>
        </div>

        {/* People list */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {sorted.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-['Open_Sans',sans-serif] text-sm text-[#A0AEC0]">
                No people found
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sorted.map((person) => {
                const status = getStatus(person.id);
                return (
                  <button
                    key={person.id}
                    onClick={() => onSelectPerson(person)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F8FA] active:bg-[#F7F8FA] transition-colors"
                  >
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117] truncate">
                          {person.name}
                        </p>
                        {status === "connected" && (
                          <span className="bg-[#E0F2FF] text-[#0A7CFF] px-1.5 py-0.5 rounded font-['Open_Sans',sans-serif] text-[9px] font-semibold flex-shrink-0">
                            Connected
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="bg-[#FFF0EC] text-[#FF5C3A] px-1.5 py-0.5 rounded font-['Open_Sans',sans-serif] text-[9px] font-semibold flex-shrink-0">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] truncate">
                        {person.title} at {person.company}
                      </p>
                    </div>
                    <MessageCircle className="w-4 h-4 text-[#A0AEC0] flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat Conversation View ───
function ChatConversation({
  chat,
  onBack,
}: {
  chat: Chat;
  onBack: () => void;
}) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChats();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(chat.id, message.trim());
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 border-b border-[#E2E8F0] flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1 active:scale-95">
          <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
        </button>
        <button
          onClick={() => navigate(`/profile/${chat.personId}`)}
          className="flex items-center gap-3 flex-1 min-w-0 active:opacity-70"
        >
          <img
            src={chat.personImage}
            alt={chat.personName}
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117] truncate">
              {chat.personName}
            </p>
            <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] truncate">
              {chat.personTitle} at {chat.personCompany}
            </p>
          </div>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-[#A0AEC0]" />
            </div>
            <p className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117] mb-1">
              Start the conversation
            </p>
            <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] text-center max-w-[240px]">
              Send a message to {chat.personName} to kick things off
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${
                    msg.fromMe
                      ? "bg-[#0A7CFF] text-white rounded-br-md"
                      : "bg-[#F7F8FA] text-[#0D1117] border border-[#E2E8F0] rounded-bl-md"
                  }`}
                >
                  <p
                    className={`font-['Open_Sans',sans-serif] text-sm ${
                      msg.fromMe ? "text-white" : "text-[#0D1117]"
                    }`}
                  >
                    {msg.text}
                  </p>
                  <p
                    className={`font-['Open_Sans',sans-serif] text-[10px] mt-1 ${
                      msg.fromMe ? "text-white/60" : "text-[#A0AEC0]"
                    }`}
                  >
                    {timeAgo(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#E2E8F0] px-4 py-3 pb-safe">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-[#F7F8FA] rounded-xl px-3.5 py-2.5 border border-[#E2E8F0]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] outline-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              message.trim()
                ? "bg-[#0A7CFF] active:scale-95"
                : "bg-[#E2E8F0]"
            }`}
          >
            <Send
              className={`w-4.5 h-4.5 ${
                message.trim() ? "text-white" : "text-[#A0AEC0]"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Chats Page ───
export default function Chats() {
  const { chats, createChat, getChat } = useChats();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewChat, setShowNewChat] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeChat = activeChatId ? getChat(activeChatId) : undefined;

  // Auto-open a chat if navigated with state
  useEffect(() => {
    if (location.state?.openChatId) {
      setActiveChatId(location.state.openChatId);
      // Clear the state so back/forward doesn't re-trigger
      window.history.replaceState({}, "");
    }
  }, [location.state?.openChatId]);

  // If there's an active conversation open, show it
  if (activeChat) {
    return (
      <ChatConversation
        chat={activeChat}
        onBack={() => setActiveChatId(null)}
      />
    );
  }

  const handleSelectPerson = (person: PersonItem) => {
    const chatId = createChat({
      id: person.id,
      name: person.name,
      imageUrl: person.imageUrl,
      title: person.title,
      company: person.company,
    });
    setShowNewChat(false);
    setActiveChatId(chatId);
  };

  const handleOpenChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  // Filter chats by search
  const filteredChats = search.trim()
    ? chats.filter((c) =>
        c.personName.toLowerCase().includes(search.toLowerCase())
      )
    : chats;

  // Sort by last activity
  const sortedChats = [...filteredChats].sort(
    (a, b) => b.lastActivity - a.lastActivity
  );

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-['Rethink_Sans',sans-serif] font-bold text-[22px] text-[#0D1117]">
            Chats
          </h1>
          <button
            onClick={() => setShowNewChat(true)}
            className="w-9 h-9 rounded-xl bg-[#0A7CFF] flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-[#F7F8FA] rounded-xl px-3 py-2.5 border border-[#E2E8F0] mb-4">
          <Search className="w-4 h-4 text-[#A0AEC0] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="p-0.5">
              <X className="w-3.5 h-3.5 text-[#A0AEC0]" />
            </button>
          )}
        </div>
      </div>

      {/* Chat list */}
      {sortedChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="w-20 h-20 rounded-2xl bg-[#F7F8FA] flex items-center justify-center mb-5 border border-[#E2E8F0]">
            <MessageCircle className="w-9 h-9 text-[#A0AEC0]" />
          </div>
          <h3 className="font-['Rethink_Sans',sans-serif] font-semibold text-base text-[#0D1117] mb-2">
            {search ? "No conversations found" : "No conversations yet"}
          </h3>
          <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] text-center mb-6 max-w-[260px]">
            {search
              ? "Try a different search term"
              : "Start chatting with your connections and recommended people"}
          </p>
          {!search && (
            <button
              onClick={() => setShowNewChat(true)}
              className="bg-[#0A7CFF] text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
              Start a Chat
            </button>
          )}
        </div>
      ) : (
        <div className="px-4">
          {sortedChats.map((chat) => {
            const lastMsg =
              chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1]
                : null;
            const unreadCount = chat.messages.filter(
              (m) => !m.fromMe
            ).length;

            return (
              <button
                key={chat.id}
                onClick={() => handleOpenChat(chat.id)}
                className="w-full flex items-center gap-3 py-3.5 border-b border-[#E2E8F0] last:border-b-0 active:bg-[#F7F8FA] transition-colors text-left"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.personImage}
                    alt={chat.personName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  {lastMsg && !lastMsg.fromMe && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0A7CFF] rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117] truncate">
                      {chat.personName}
                    </p>
                    {lastMsg && (
                      <span className="font-['Open_Sans',sans-serif] text-[10px] text-[#A0AEC0] flex-shrink-0">
                        {timeAgo(lastMsg.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] truncate">
                    {lastMsg
                      ? `${lastMsg.fromMe ? "You: " : ""}${lastMsg.text}`
                      : "No messages yet — say hello!"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* New chat sheet */}
      {showNewChat && (
        <NewChatSheet
          onClose={() => setShowNewChat(false)}
          onSelectPerson={handleSelectPerson}
        />
      )}

      <BottomNav />
    </div>
  );
}