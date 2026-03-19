import { useNavigate, useParams, useLocation } from "react-router";
import {
  ChevronLeft, MapPin, Users, Briefcase, Calendar,
  MessageCircle, UserPlus, Check, Share2, Mail, Link2,
} from "lucide-react";
import React, { useState } from "react";
import { recommendedPeople } from "../data/events";
import { BottomNav } from "../components/BottomNav";
import { useConnections } from "../contexts/ConnectionsContext";
import { useChats } from "../contexts/ChatsContext";
import { useGoBack } from "../hooks/useGoBack";

// ------------------------------------------------------------------
// Section Card wrapper — mirrors UserProfile's SectionCard
// ------------------------------------------------------------------
function SectionCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['Rethink_Sans',sans-serif] text-base font-semibold text-[#0D1117]">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getStatus, toggleConnection } = useConnections();
  const { createChat, sendMessage: sendChatMessage } = useChats();
  const friendStatus = id ? getStatus(id) : "none";
  const [showMessageSheet, setShowMessageSheet] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const fromPath = (location.state as { from?: string })?.from || "/";
  const goBack = useGoBack(fromPath);
  const person = recommendedPeople.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-[#A0AEC0]" />
        </div>
        <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-2">Profile not found</h2>
        <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mb-6">This person doesn't exist in our network.</p>
        <button
          onClick={() => goBack()}
          className="px-6 py-3 bg-[#0A7CFF] text-white rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleFriendInvite = () => {
    if (id) toggleConnection(id);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !person) return;
    // Create or get existing chat, send message, navigate to conversation
    const chatId = createChat({
      id: person.id,
      name: person.name,
      imageUrl: person.imageUrl,
      title: person.title,
      company: person.company,
    });
    sendChatMessage(chatId, messageText.trim());
    setMessageSent(true);
    setMessageText("");
    setTimeout(() => {
      setShowMessageSheet(false);
      setMessageSent(false);
      navigate("/chats", { state: { openChatId: chatId } });
    }, 1200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: person.name,
        text: `Check out ${person.name}'s profile on Linkberry`,
        url: window.location.href,
      });
    }
  };

  // Mock stats per person (seeded by id)
  const seed = person.id.charCodeAt(person.id.length - 1);
  const mockStats = {
    events: 8 + (seed % 30),
    connections: 40 + (seed % 120),
    messages: 5 + (seed % 20),
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-['Open_Sans',sans-serif] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0]">
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => goBack()}
            className="p-2 -ml-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
          </button>
          <h1 className="font-['Rethink_Sans',sans-serif] font-semibold text-[#0D1117]">
            {person.name.split(" ")[0]}'s Profile
          </h1>
          <button
            onClick={handleShare}
            className="p-2 -mr-2 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-[#0D1117]" />
          </button>
        </div>
      </div>

      {/* Profile Hero Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-start gap-4">
            <img
              src={person.imageUrl}
              alt={person.name}
              className="w-28 h-28 rounded-2xl object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117]">
                  {person.name}
                </h1>
              </div>

              <div className="mb-1.5">
                <span className="inline-flex bg-[#2E9BF5] rounded-full px-2.5 py-0.5 font-['Rethink_Sans',sans-serif] font-semibold text-[11px] text-white leading-tight">
                  {person.matchPercentage}% match
                </span>
              </div>

              <p className="font-['Open_Sans',sans-serif] text-sm text-[#0D1117]">
                {person.title}
              </p>
              <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-1">
                {person.company}
              </p>

              {person.location && (
                <div className="flex items-center gap-1.5 text-[#718096] mb-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-['Open_Sans',sans-serif] text-xs">{person.location}</span>
                </div>
              )}

              {person.mutualConnections && (
                <div className="flex items-center gap-1.5 text-[#0A7CFF]">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-['Open_Sans',sans-serif] text-xs font-medium">
                    {person.mutualConnections} mutual connections
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleFriendInvite}
              className={`flex-1 py-3 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                friendStatus === "pending"
                  ? "bg-[#F7F8FA] text-[#0A7CFF] border-2 border-[#0A7CFF]"
                  : friendStatus === "connected"
                  ? "bg-[#0A7CFF]/10 text-[#0A7CFF]"
                  : "bg-[#0A7CFF] text-white active:scale-[0.98]"
              }`}
            >
              {friendStatus === "pending" ? (
                <>
                  <Check className="w-4 h-4" />
                  Pending
                </>
              ) : friendStatus === "connected" ? (
                <>
                  <Check className="w-4 h-4" />
                  Connected
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Connect
                </>
              )}
            </button>
            <button
              onClick={() => setShowMessageSheet(true)}
              className="flex-1 py-3 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold bg-[#F7F8FA] text-[#0D1117] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Networking Stats Card */}
      <div className="px-4 mt-3">
        <SectionCard title="Networking Stats">
          <div className="flex items-center gap-3">
            {[
              { label: "Events", value: String(mockStats.events), color: "#0A7CFF", iconEl: <Calendar className="w-4 h-4" /> },
              { label: "Connections", value: String(mockStats.connections), color: "#2E9BF5", iconEl: <Users className="w-4 h-4" /> },
              { label: "Messages", value: String(mockStats.messages), color: "#FF5C3A", iconEl: <MessageCircle className="w-4 h-4" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 bg-[#F7F8FA] rounded-xl p-3.5 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {stat.iconEl}
                </div>
                <div className="text-center">
                  <p className="font-['Rethink_Sans',sans-serif] font-bold text-lg text-[#0D1117] leading-tight">{stat.value}</p>
                  <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* About Card */}
      {person.bio && (
        <div className="px-4 mt-3">
          <SectionCard title="About">
            <p className="font-['Open_Sans',sans-serif] text-sm text-[#4A5568] leading-relaxed">
              {person.bio}
            </p>
          </SectionCard>
        </div>
      )}

      {/* Experience Card */}
      {person.experience && person.experience.length > 0 && (
        <div className="px-4 mt-3">
          <SectionCard title="Experience">
            <div className="space-y-0">
              {person.experience.map((exp, index) => (
                <div key={index}>
                  {index > 0 && <div className="border-t border-[#E2E8F0] my-4" />}
                  <div className="flex gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4 text-[#718096]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117]">
                        {exp.role}
                      </h3>
                      <p className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117] mt-0.5">
                        {exp.company}
                      </p>
                      <p className="font-['Open_Sans',sans-serif] text-[11px] text-[#718096] mt-1">
                        {exp.duration}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Skills / Interests Card */}
      {person.skills && person.skills.length > 0 && (
        <div className="px-4 mt-3">
          <SectionCard title="Interests">
            <div className="flex flex-wrap gap-2">
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 bg-[#F7F8FA] rounded-full font-['Open_Sans',sans-serif] text-xs font-medium text-[#0D1117]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Events Attending Card */}
      {person.eventsAttending && person.eventsAttending.length > 0 && (
        <div className="px-4 mt-3 mb-6">
          <SectionCard title="Events Attending">
            <div className="space-y-2.5">
              {person.eventsAttending.map((eventName) => (
                <div
                  key={eventName}
                  className="flex items-center gap-3 p-3.5 bg-[#F7F8FA] rounded-xl"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0A7CFF15] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[#0A7CFF]" />
                  </div>
                  <span className="font-['Open_Sans',sans-serif] text-sm font-medium text-[#0D1117] flex-1 min-w-0">
                    {eventName}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Message Bottom Sheet */}
      {showMessageSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => {
              setShowMessageSheet(false);
              setMessageSent(false);
            }}
          />

          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-[24px] shadow-2xl">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>

            <div className="px-5 flex justify-between items-center mb-2">
              <h3 className="font-['Rethink_Sans',sans-serif] text-lg font-semibold text-[#0D1117]">
                Message {person.name.split(" ")[0]}
              </h3>
              <button
                onClick={() => {
                  setShowMessageSheet(false);
                  setMessageSent(false);
                }}
                className="p-2 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#0D1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-10">
              {messageSent ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                    <Check className="w-7 h-7 text-[#10B981]" />
                  </div>
                  <p className="font-['Open_Sans',sans-serif] text-base font-semibold text-[#0D1117]">
                    Message sent!
                  </p>
                  <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mt-1">
                    {person.name.split(" ")[0]} will be notified
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-[#F7F8FA] rounded-xl">
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117]">
                        {person.name}
                      </p>
                      <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096]">
                        {person.title} at {person.company}
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Hi ${person.name.split(" ")[0]}, I'd love to connect...`}
                    rows={4}
                    enterKeyHint="send"
                    onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
                    className="w-full p-4 border border-[#E2E8F0] rounded-xl text-sm font-['Open_Sans',sans-serif] text-[#0D1117] placeholder:text-[#A0AEC0] resize-none focus:outline-none focus:border-[#0A7CFF] focus:ring-1 focus:ring-[#0A7CFF] transition-colors"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={`w-full mt-3 py-3.5 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      messageText.trim()
                        ? "bg-[#0A7CFF] text-white active:scale-[0.98]"
                        : "bg-[#E2E8F0] text-[#A0AEC0] cursor-not-allowed"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}