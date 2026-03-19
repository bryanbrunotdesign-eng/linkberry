import { X, Calendar, Clock, MapPin, Users, Edit2, Trash2, Save, Check, FileText, Hand, CalendarPlus, Sparkles, UserPlus } from "lucide-react";
import { CalendarBlockData } from "../../pages/Calendar";
import { useState, useEffect } from "react";
import { TimePicker } from "./TimePicker";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useConnections } from "../../contexts/ConnectionsContext";

interface EventDetailSheetProps {
  block: CalendarBlockData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (block: CalendarBlockData) => void;
  onDelete?: (blockId: string) => void;
  onAddToCalendar?: (block: CalendarBlockData) => void;
}

export function EventDetailSheet({ block, isOpen, onClose, onUpdate, onDelete, onAddToCalendar }: EventDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlock, setEditedBlock] = useState<CalendarBlockData | null>(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isAttending, setIsAttending] = useState(block?.isAttending || false);
  const [tappedPeople, setTappedPeople] = useState<Set<string>>(new Set());
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const { getStatus, toggleConnection } = useConnections();

  // Lock body scroll when open
  useScrollLock(isOpen);

  // Reset form when block changes
  useEffect(() => {
    if (block) {
      setEditedBlock(block);
      setPersonalNotes("");
      setIsEditing(false);
      setIsAddingNotes(false);
      setIsAttending(block.isAttending || false);
      setAddedToCalendar(false);
    }
  }, [block]);

  if (!block) return null;

  const isPersonal = block.type === "personal";
  const canEdit = isPersonal;

  const handleSave = () => {
    if (onUpdate && editedBlock) {
      onUpdate(editedBlock);
      setIsEditing(false);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && block && confirm("Delete this event?")) {
      onDelete(block.id);
      onClose();
    }
  };

  const handleAddNote = () => {
    if (personalNotes.trim() && onUpdate && block) {
      const currentDesc = block.description || "";
      const updatedDesc = currentDesc 
        ? `${currentDesc}\n\nNotes: ${personalNotes}`
        : `Notes: ${personalNotes}`;
      
      onUpdate({
        ...block,
        description: updatedDesc
      });
      setPersonalNotes("");
      setIsAddingNotes(false);
    }
  };

  const handleToggleAttending = () => {
    if (onUpdate && block && !isPersonal) {
      const newAttendingStatus = !isAttending;
      setIsAttending(newAttendingStatus);
      onUpdate({
        ...block,
        isAttending: newAttendingStatus
      });
    }
  };

  const handleSendTap = (personId: string, personName: string) => {
    setTappedPeople(prev => new Set(prev).add(personId));
    // In a real app, this would send a notification to the person
    // For now, we'll just show visual feedback via the tappedPeople state
  };

  const handleAddToCalendar = () => {
    if (onAddToCalendar && block) {
      onAddToCalendar(block);
      setAddedToCalendar(true);
    }
  };

  // Get block color based on type and kind
  const getBlockColor = () => {
    if (block.type === "event") {
      switch (block.kind) {
        case "speaker": return "#2E9BF5";
        case "panel": return "#0057B8";
        case "workshop": return "#7BC8FF";
        case "break": return "#E2E8F0";
        default: return "#2E9BF5";
      }
    } else {
      switch (block.kind) {
        case "meetup": return "#FF5C3A";
        case "group": return "#FF8C6B";
        case "note": return "#F0C875";
        case "personal-break": return "#3B82F6";
        default: return "#FF5C3A";
      }
    }
  };

  const getKindLabel = (kind: string) => {
    const labels: Record<string, string> = {
      "speaker": "Speaker Session",
      "panel": "Panel Discussion",
      "workshop": "Workshop",
      "break": "Break",
      "meetup": "1:1 Meetup",
      "group": "Group Meeting",
      "note": "Note",
      "personal-break": "Break"
    };
    return labels[kind] || kind;
  };

  const blockColor = getBlockColor();

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
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 ease-out z-[60] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85dvh' }}
      >
        <div className="flex flex-col h-full max-h-[85dvh]">
          {/* Header */}
          <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: blockColor }}
                  />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {getKindLabel(block.kind)}
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedBlock?.title || ""}
                    onChange={(e) => setEditedBlock({ ...editedBlock!, title: e.target.value })}
                    className="w-full text-2xl font-bold text-gray-900 border-b-2 border-[#0A7CFF] focus:outline-none pb-1"
                    placeholder="Event title"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{block.title}</h2>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors -mr-2"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              {isEditing ? (
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <TimePicker
                    label="Start"
                    value={editedBlock?.startTime || ""}
                    onChange={(time) => setEditedBlock({ ...editedBlock!, startTime: time })}
                  />
                  <TimePicker
                    label="End"
                    value={editedBlock?.endTime || ""}
                    onChange={(time) => setEditedBlock({ ...editedBlock!, endTime: time })}
                  />
                </div>
              ) : (
                <span className="font-medium">
                  {formatTime(block.startTime)} - {formatTime(block.endTime)}
                </span>
              )}
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Description */}
            {(block.description || isEditing) && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedBlock?.description || ""}
                    onChange={(e) => setEditedBlock({ ...editedBlock!, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]"
                    rows={3}
                    placeholder="Add description..."
                  />
                ) : (
                  <p className="text-gray-600 whitespace-pre-wrap">{block.description}</p>
                )}
              </div>
            )}

            {/* Suggested Person to Meet (for personal meetup blocks from recommendations) */}
            {isPersonal && !isEditing && block.suggestedPerson && (() => {
              const personId = block.suggestedPerson!.id;
              const connStatus = getStatus(personId);
              const hasTapped = tappedPeople.has(personId);
              return (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0A7CFF]" />
                  Suggested Match for This Meetup
                </h3>
                <div className="p-4 bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={block.suggestedPerson!.imageUrl}
                      alt={block.suggestedPerson!.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-['Open_Sans',sans-serif] font-semibold text-[#0D1117]">
                        {block.suggestedPerson!.name}
                      </h4>
                      <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] truncate">
                        {block.suggestedPerson!.title} at {block.suggestedPerson!.company}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-['Open_Sans',sans-serif] text-[#0A7CFF] bg-[#0A7CFF]/10">
                        {block.suggestedPerson!.matchPercentage}% match
                      </span>
                    </div>
                  </div>
                  <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-3">
                    This person is a great match for a 1-on-1 conversation. Send a tap to let them know you'd like to meet up!
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleConnection(personId)}
                      className={`flex-1 py-2.5 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        connStatus === "pending"
                          ? "bg-[#E2E8F0] text-[#718096]"
                          : connStatus === "connected"
                            ? "bg-[#0A7CFF]/10 text-[#0A7CFF]"
                            : "bg-[#0A7CFF] text-white active:scale-[0.98]"
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      {connStatus === "pending" ? "Request Sent" : connStatus === "connected" ? "Connected" : "Connect"}
                    </button>
                    <button
                      onClick={() => handleSendTap(personId, block.suggestedPerson!.name)}
                      disabled={hasTapped}
                      className={`flex-1 py-2.5 rounded-xl font-['Open_Sans',sans-serif] font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        hasTapped
                          ? 'bg-[#E0F2FF] text-[#0A7CFF] cursor-default'
                          : 'bg-[#FF5C3A] text-white active:scale-[0.98]'
                      }`}
                    >
                      <Hand className="w-4 h-4" />
                      {hasTapped ? 'Tap Sent!' : 'Send Tap'}
                    </button>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* Attendees */}
            {block.attendees && block.attendees.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Attendees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {block.attendees.map((attendee, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended People to Meet (for Event Agenda items) */}
            {!isPersonal && block.recommendedPeople && block.recommendedPeople.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  People You Should Meet
                  {block.matchesAttending && (
                    <span className="ml-auto text-xs font-normal text-gray-500">
                      {block.matchesAttending} {block.matchesAttending === 1 ? 'match' : 'matches'} attending
                    </span>
                  )}
                </h3>
                <div className="space-y-3">
                  {block.recommendedPeople.map((person) => {
                    const hasTapped = tappedPeople.has(person.id);
                    return (
                      <div
                        key={person.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900">{person.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{person.title}</p>
                              <p className="text-xs text-gray-500 truncate">{person.company}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {person.matchScore && (
                                <span className="text-xs font-medium text-[#0A7CFF] bg-[#E0F2FF] px-2 py-0.5 rounded-full">
                                  {person.matchScore}% match
                                </span>
                              )}
                              {/* Send Tap Button */}
                              <button
                                onClick={() => handleSendTap(person.id, person.name)}
                                disabled={hasTapped}
                                className={`px-3 py-1.5 rounded-xl font-['Open_Sans',sans-serif] text-xs font-medium transition-all flex items-center gap-1.5 ${
                                  hasTapped
                                    ? 'bg-[#E0F2FF] text-[#0A7CFF] cursor-default'
                                    : 'bg-[#0A7CFF] text-white active:scale-95'
                                }`}
                              >
                                <Hand className="w-3.5 h-3.5" />
                                {hasTapped ? 'Tap Sent!' : 'Send Tap'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Notes Section (for Event Agenda items) */}
            {!isPersonal && !isEditing && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  My Notes
                </h3>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] mb-2"
                  rows={3}
                  placeholder="Add your notes about this event..."
                />
                <button
                  onClick={handleAddNote}
                  disabled={!personalNotes.trim()}
                  className="px-4 py-2 bg-[#0A7CFF] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
            {canEdit && (
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-3 bg-[#0A7CFF] text-white rounded-xl font-semibold transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 px-4 py-3 bg-[#0A7CFF] text-white rounded-xl font-semibold transition-colors"
                    >
                      Edit Event
                    </button>
                  </>
                )}
              </div>
            )}
            {!canEdit && (
              <div className="space-y-3">
                {/* Attending Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Attending Event</p>
                      <p className="text-xs text-gray-500">Let matches know you'll be there</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleAttending}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E9BF5] focus:ring-offset-2 ${
                      isAttending ? 'bg-[#2E9BF5]' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={isAttending}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                        isAttending ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Add to Calendar Button */}
                <button
                  onClick={handleAddToCalendar}
                  disabled={addedToCalendar}
                  className={`w-full px-4 py-4 rounded-xl font-['Open_Sans',sans-serif] font-semibold transition-all flex items-center justify-center gap-2 ${
                    addedToCalendar
                      ? 'bg-[#FF5C3A]/10 text-[#FF5C3A] cursor-default'
                      : 'bg-[#FF5C3A] text-white active:scale-[0.98]'
                  }`}
                >
                  {addedToCalendar ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to My Plan
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="w-5 h-5" />
                      Add to My Plan
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}