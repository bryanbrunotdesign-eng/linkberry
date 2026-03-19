import { useState, useEffect } from "react";
import { BlockKind, CalendarBlockData } from "../../pages/Calendar";
import { X, Users, FileText, Pause, UsersRound, Sparkles, UserPlus } from "lucide-react";
import { TimePicker } from "./TimePicker";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useConnections } from "../../contexts/ConnectionsContext";
import type { SuggestionPerson } from "./SmartSuggestions";

export interface AddBlockPrefill {
  title?: string;
  kind?: BlockKind;
  startTime?: string;
  endTime?: string;
  description?: string;
  isRecommendation?: boolean;
  recommendedPerson?: SuggestionPerson;
}

interface AddBlockSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (block: Omit<CalendarBlockData, "id" | "type">) => void;
  selectedTime: string;
  prefill?: AddBlockPrefill | null;
}

export function AddBlockSheet({ isOpen, onClose, onAdd, selectedTime, prefill }: AddBlockSheetProps) {
  const [selectedKind, setSelectedKind] = useState<BlockKind>("meetup");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const { getStatus, toggleConnection } = useConnections();

  // Prevent background scroll when sheet is open
  useScrollLock(isOpen);

  useEffect(() => {
    if (prefill && isOpen) {
      if (prefill.title) setTitle(prefill.title);
      if (prefill.kind) setSelectedKind(prefill.kind);
      if (prefill.startTime) setStartTime(prefill.startTime);
      if (prefill.endTime) setEndTime(prefill.endTime);
      if (prefill.description) setDescription(prefill.description);
    }
  }, [prefill, isOpen]);

  useEffect(() => {
    if (prefill) return; // Don't override prefill with selectedTime
    if (selectedTime && selectedTime.includes(':')) {
      setStartTime(selectedTime);
      // Auto-set end time to 1 hour later
      const [hours, minutes] = selectedTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const endMinutes = minutes;
        const endHours = hours + 1;
        setEndTime(`${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`);
      }
    }
  }, [selectedTime, prefill]);

  const blockTypes: { kind: BlockKind; label: string; icon: React.ReactNode; color: string; selectedBg: string; selectedText: string }[] = [
    { 
      kind: "meetup", 
      label: "1:1 Meetup", 
      icon: <Users className="w-4 h-4" />, 
      color: "#FF5C3A",
      selectedBg: "#FF5C3A",
      selectedText: "#FFFFFF"
    },
    { 
      kind: "group", 
      label: "Group", 
      icon: <UsersRound className="w-4 h-4" />, 
      color: "#FF8C6B",
      selectedBg: "#FF8C6B",
      selectedText: "#FFFFFF"
    },
    { 
      kind: "note", 
      label: "Note", 
      icon: <FileText className="w-4 h-4" />, 
      color: "#F0C875",
      selectedBg: "#F0C875",
      selectedText: "#0D1117"
    },
    { 
      kind: "personal-break", 
      label: "Break", 
      icon: <Pause className="w-4 h-4" />, 
      color: "#3B82F6",
      selectedBg: "#3B82F6",
      selectedText: "#FFFFFF"
    }
  ];

  const handleAdd = () => {
    if (title.trim()) {
      onAdd({
        kind: selectedKind,
        title: title.trim(),
        startTime,
        endTime,
        description: description.trim() || undefined,
        suggestedPerson: prefill?.recommendedPerson || undefined,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedKind("meetup");
      // Close the sheet after adding
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
          isOpen ? 'opacity-20 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 ease-out z-[60] flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85dvh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 overscroll-contain pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-semibold text-gray-900">
                {prefill?.isRecommendation ? 'Add to Plan' : 'New Event'}
              </h2>
              {prefill?.isRecommendation && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-['Open_Sans',sans-serif] uppercase tracking-wider text-[#0A7CFF] bg-[#0A7CFF]/10">
                  Recommended
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Title Input */}
          <div className="mb-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full px-0 py-3 text-lg font-medium text-gray-900 placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-[#0A7CFF] focus:outline-none transition-colors"
              autoFocus
              enterKeyHint="done"
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <TimePicker
              label="Start"
              value={startTime}
              onChange={setStartTime}
            />
            <TimePicker
              label="End"
              value={endTime}
              onChange={setEndTime}
            />
          </div>

          {/* Event Type Selector */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
              Event Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {blockTypes.map(({ kind, label, icon, color, selectedBg, selectedText }) => (
                <button
                  key={kind}
                  onClick={() => setSelectedKind(kind)}
                  className={`px-3 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${
                    selectedKind === kind
                      ? ""
                      : "bg-gray-50 text-gray-700"
                  }`}
                  style={
                    selectedKind === kind
                      ? {
                          backgroundColor: selectedBg,
                          color: selectedText
                        }
                      : {}
                  }
                >
                  {icon}
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              enterKeyHint="done"
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] focus:border-transparent resize-none"
            />
          </div>

          {/* Recommended Person Card */}
          {prefill?.recommendedPerson && (() => {
            const personId = prefill.recommendedPerson!.id;
            const connectionStatus = getStatus(personId);
            return (
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0A7CFF]" />
                Suggested Connection
              </label>
              <div className="p-3.5 bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={prefill.recommendedPerson!.imageUrl}
                    alt={prefill.recommendedPerson!.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117] truncate">
                      {prefill.recommendedPerson!.name}
                    </p>
                    <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] truncate">
                      {prefill.recommendedPerson!.title} at {prefill.recommendedPerson!.company}
                    </p>
                  </div>
                  <span className="flex-shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold font-['Open_Sans',sans-serif] text-[#0A7CFF] bg-[#0A7CFF]/10">
                    {prefill.recommendedPerson!.matchPercentage}% match
                  </span>
                </div>
                <button
                  onClick={() => toggleConnection(personId)}
                  className={`mt-3 w-full py-2.5 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    connectionStatus === "pending"
                      ? "bg-[#E2E8F0] text-[#718096]"
                      : connectionStatus === "connected"
                        ? "bg-[#0A7CFF]/10 text-[#0A7CFF]"
                        : "bg-[#0A7CFF] text-white active:scale-[0.98]"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  {connectionStatus === "pending" ? "Request Sent" : connectionStatus === "connected" ? "Connected" : "Connect"}
                </button>
              </div>
            </div>
            );
          })()}

          {/* Create Event Button - directly after description */}
          <div className="pb-[calc(90px+24px)]">
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full py-4 bg-[#0A7CFF] text-white font-semibold text-base rounded-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {prefill?.isRecommendation ? 'Add to My Plan' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}