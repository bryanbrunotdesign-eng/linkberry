import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CalendarHeader } from "../components/calendar/CalendarHeader";
import { CalendarBlock } from "../components/calendar/CalendarBlock";
import { AddBlockSheet } from "../components/calendar/AddBlockSheet";
import type { AddBlockPrefill } from "../components/calendar/AddBlockSheet";
import { EventDetailSheet } from "../components/calendar/EventDetailSheet";
import { SmartSuggestions } from "../components/calendar/SmartSuggestions";
import { BottomNav } from "../components/BottomNav";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCalendarEvents } from "../contexts/CalendarEventsContext";
import { getAppNow, getAppToday } from "../utils/appDate";

export type BlockType = "event" | "personal";
export type BlockKind = "speaker" | "panel" | "workshop" | "break" | "meetup" | "group" | "note" | "personal-break";

export interface CalendarBlockData {
  id: string;
  type: BlockType;
  kind: BlockKind;
  title: string;
  date?: string; // YYYY-MM-DD format — which day this block belongs to
  eventTitle?: string; // Parent event title (e.g. "AI Revolution Summit 2024")
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
  attendees?: string[];
  matchesAttending?: number; // Number of profile matches attending this event
  isAttending?: boolean; // User's attendance status for event agenda items
  recommendedPeople?: {
    id: string;
    name: string;
    title: string;
    company: string;
    image?: string;
    matchScore?: number;
  }[];
  suggestedPerson?: {
    id: string;
    name: string;
    title: string;
    company: string;
    imageUrl: string;
    matchPercentage: number;
  };
}

export default function Calendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { blocks, addBlock, updateBlock, removeBlock } = useCalendarEvents();
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addSheetPrefill, setAddSheetPrefill] = useState<AddBlockPrefill | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<CalendarBlockData | null>(null);
  const [highlightedSlot, setHighlightedSlot] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<"event" | "personal">("event");
  const [previousLayer, setPreviousLayer] = useState<"event" | "personal">("event");
  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const parsed = new Date(dateParam + "T00:00:00");
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return getAppToday(); // Default to today
  });
  const timeGridRef = useRef<HTMLDivElement>(null);

  // Track layer changes for animation direction
  const handleLayerChange = (newLayer: "event" | "personal") => {
    setPreviousLayer(selectedLayer);
    setSelectedLayer(newLayer);
  };

  // Determine animation direction
  const getAnimationDirection = () => {
    // Event is index 0, Personal is index 1
    // If going from Event (0) to Personal (1), slide right (exit left, enter right)
    // If going from Personal (1) to Event (0), slide left (exit right, enter left)
    if (previousLayer === "event" && selectedLayer === "personal") {
      return { exit: -100, enter: 100 }; // Swipe left to right
    } else {
      return { exit: 100, enter: -100 }; // Swipe right to left
    }
  };

  const animationDir = getAnimationDirection();

  // Generate time slots (6 AM to 10 PM in 30-min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 22 && minute === 30) break;
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get current time for indicator
  const getCurrentTime = () => {
    const now = getAppNow();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const [currentTime] = useState(getCurrentTime());

  // Calculate position for current time indicator
  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 6 * 60; // 6 AM
    return ((totalMinutes - startMinutes) / 30) * 72; // 72px per 30-min slot
  };

  const handleSlotClick = (time: string) => {
    // If slot is already highlighted, open the add sheet
    if (highlightedSlot === time) {
      setSelectedSlot(time);
      setAddSheetPrefill(null);
      setAddSheetOpen(true);
      setHighlightedSlot(null);
    } else {
      // First click: highlight the slot
      setHighlightedSlot(time);
    }
  };

  // Auto-hide highlighted slot after 4 seconds
  useEffect(() => {
    if (highlightedSlot) {
      const timer = setTimeout(() => {
        setHighlightedSlot(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [highlightedSlot]);

  const handleAddBlock = (blockData: Omit<CalendarBlockData, "id" | "type">) => {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const newBlock: CalendarBlockData = {
      ...blockData,
      id: `block-${Date.now()}`,
      type: "personal",
      date: `${yyyy}-${mm}-${dd}`,
    };
    addBlock(newBlock);
    setAddSheetOpen(false);
  };

  const handleBlockClick = (block: CalendarBlockData) => {
    setSelectedBlock(block);
    setDetailSheetOpen(true);
  };

  const handleUpdateBlock = (updatedBlock: CalendarBlockData) => {
    updateBlock(updatedBlock.id, updatedBlock);
  };

  const handleDeleteBlock = (id: string) => {
    removeBlock(id);
  };

  const handleAddToCalendar = (eventBlock: CalendarBlockData) => {
    // Create a personal plan block from an event agenda item
    const personalBlock: CalendarBlockData = {
      ...eventBlock,
      id: `added-${Date.now()}`,
      type: "personal",
      // Keep the same time and title, but mark it as a meetup by default
      kind: "meetup",
      // Clear event-specific data
      matchesAttending: undefined,
      recommendedPeople: undefined,
      isAttending: undefined,
      attendees: undefined
    };
    addBlock(personalBlock);
  };

  // Scroll to current time on mount
  useEffect(() => {
    if (!timeGridRef.current || currentTime < "06:00" || currentTime > "22:00") {
      return;
    }
    
    // Delay to ensure DOM is fully rendered and layout is stable
    const scrollTimer = setTimeout(() => {
      if (timeGridRef.current) {
        const currentPos = getTimePosition(currentTime);
        const viewportHeight = timeGridRef.current.clientHeight;
        
        // Position the current time indicator at the center of the viewport (50%)
        // This puts the red "now" line in the middle of the screen
        const targetScrollPosition = currentPos - (viewportHeight * 0.5);
        
        // Ensure we don't scroll to negative values
        timeGridRef.current.scrollTop = Math.max(0, targetScrollPosition);
      }
    }, 300);
    
    return () => clearTimeout(scrollTimer);
  }, [currentTime]);

  // Helper: format selectedDate to YYYY-MM-DD for comparison
  const selectedDateStr = (() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  // Filter blocks based on selected layer and selected date
  const getVisibleBlocks = () => {
    return blocks.filter(b => {
      if (b.type !== selectedLayer) return false;
      // Only show blocks whose date matches the selected day
      return b.date === selectedDateStr;
    });
  };

  // Check if there are any events on the selected date
  const hasEventsOnSelectedDate = () => {
    return blocks.some(b => b.type === "event" && b.date === selectedDateStr);
  };

  // Helper: convert "HH:MM" to total minutes
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // Check if ANY block covers this time slot (for disabling empty-slot click)
  const hasBlockAtSlot = (time: string) => {
    const s = toMin(time);
    return getVisibleBlocks().some(b => s >= toMin(b.startTime) && s < toMin(b.endTime));
  };

  // ── Full-range overlap layout algorithm ──
  // Pre-computes column index + total columns for every visible block
  // so that blocks whose time ranges overlap are placed side-by-side,
  // even if they start at different 30-min slots.
  const blockLayout = (() => {
    const visible = getVisibleBlocks();
    // Sort by start, then by duration descending (longer blocks claim earlier columns)
    const sorted = [...visible].sort((a, b) => {
      const d = toMin(a.startTime) - toMin(b.startTime);
      if (d !== 0) return d;
      return (toMin(b.endTime) - toMin(b.startTime)) - (toMin(a.endTime) - toMin(a.startTime));
    });

    const layout = new Map<string, { column: number; totalColumns: number }>();
    const placed: { id: string; start: number; end: number; column: number }[] = [];

    // Greedy column assignment
    for (const block of sorted) {
      const bStart = toMin(block.startTime);
      const bEnd = toMin(block.endTime);
      const overlapping = placed.filter(p => p.start < bEnd && bStart < p.end);
      const usedCols = new Set(overlapping.map(p => p.column));
      let col = 0;
      while (usedCols.has(col)) col++;
      placed.push({ id: block.id, start: bStart, end: bEnd, column: col });
      layout.set(block.id, { column: col, totalColumns: 1 });
    }

    // Build transitive overlap clusters to compute totalColumns
    for (const block of sorted) {
      const clusterIds = new Set<string>();
      const queue = [block.id];
      while (queue.length > 0) {
        const cur = queue.pop()!;
        if (clusterIds.has(cur)) continue;
        clusterIds.add(cur);
        const cp = placed.find(p => p.id === cur)!;
        for (const other of placed) {
          if (!clusterIds.has(other.id) && cp.start < other.end && other.start < cp.end) {
            queue.push(other.id);
          }
        }
      }
      const maxCol = Math.max(...[...clusterIds].map(id => layout.get(id)!.column));
      const totalCols = maxCol + 1;
      for (const id of clusterIds) {
        const entry = layout.get(id)!;
        entry.totalColumns = Math.max(entry.totalColumns, totalCols);
      }
    }
    return layout;
  })();

  // Get blocks that START within a given 30-min slot (for rendering)
  const getBlocksStartingAtSlot = (time: string) => {
    const slotStart = toMin(time);
    const slotEnd = slotStart + 30;
    return getVisibleBlocks().filter(b => {
      const bs = toMin(b.startTime);
      return bs >= slotStart && bs < slotEnd;
    });
  };

  // Px offset for a block within its starting slot row
  const getBlockSlotOffset = (blockStartTime: string, slotTime: string) => {
    return ((toMin(blockStartTime) - toMin(slotTime)) / 30) * 72;
  };

  return (
    <div className="bg-white min-h-screen font-['Open_Sans',sans-serif] flex flex-col">
      {/* Header with Layer Selector */}
      <CalendarHeader 
        onBackClick={() => navigate("/")}
        selectedLayer={selectedLayer}
        onLayerChange={handleLayerChange}
        eventBlocks={blocks}
        onDateChange={setSelectedDate}
        initialDate={selectedDate}
      />

      {/* Time Grid Container */}
      <div 
        ref={timeGridRef}
        className="flex-1 overflow-y-auto pb-32 bg-gray-50"
        style={{ paddingTop: (selectedLayer === "event" && hasEventsOnSelectedDate()) ? '330px' : '280px' }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-white rounded-lg my-4">
            {/* Current time indicator */}
            {currentTime >= "06:00" && currentTime <= "22:00" && (
              <div 
                className="absolute left-0 right-0 z-30 flex items-center pointer-events-none"
                style={{ top: `${getTimePosition(currentTime)}px` }}
              >
                <div className="w-16 flex justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
                <div className="flex-1 h-[2px] bg-red-500" />
              </div>
            )}

            {/* Time slots */}
            {timeSlots.map((time) => {
              const [hours, minutes] = time.split(":");
              const hour = parseInt(hours);
              const isHour = minutes === "00";
              const isHighlighted = highlightedSlot === time;
              const blockAtSlot = hasBlockAtSlot(time);

              return (
                <div key={time} className="relative flex">
                  {/* Time label */}
                  <div className="w-16 flex-shrink-0 pr-3 pt-1 text-right">
                    {isHour && (
                      <span className="text-xs font-medium text-gray-500">
                        {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </span>
                    )}
                  </div>

                  {/* Calendar area */}
                  <div className="flex-1 relative border-l border-gray-200" style={{ minHeight: "72px" }}>
                    {/* Hour line */}
                    {isHour && (
                      <div className="absolute top-0 left-0 right-0 border-t border-gray-200" />
                    )}
                    
                    {/* Half-hour line (subtle) */}
                    {!isHour && (
                      <div className="absolute top-0 left-0 right-0 border-t border-gray-100" />
                    )}

                    {/* Clickable empty slot area */}
                    <button
                        onClick={() => handleSlotClick(time)}
                        className={`absolute inset-0 transition-colors ${
                          isHighlighted ? 'active:bg-gray-50' : ''
                        }`}
                        style={{
                          top: '4px',
                          left: '12px',
                          right: '12px',
                          height: '64px',
                          zIndex: isHighlighted ? 40 : (blockAtSlot ? -1 : 10),
                          pointerEvents: isHighlighted ? 'auto' : (blockAtSlot ? 'none' : 'auto')
                        }}
                      >
                        {isHighlighted && (
                          <div 
                            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2"
                            style={{
                              border: '2px dashed #2E9BF5',
                              backgroundColor: 'rgba(46, 155, 245, 0.15)'
                            }}
                          >
                            <Plus className="w-8 h-8 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>

                    {/* Render blocks that start at this time - with overflow hidden container */}
                    <div className="absolute inset-0 overflow-x-clip">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={selectedLayer}
                          initial={{ x: `${animationDir.enter}%`, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: `${animationDir.exit}%`, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          {(() => {
                            const blocksStartingAtSlot = getBlocksStartingAtSlot(time);
                            const totalBlocks = blocksStartingAtSlot.length;
                            
                            return blocksStartingAtSlot.map((block, index) => {
                              const layout = blockLayout.get(block.id)!;
                              return (
                                <CalendarBlock
                                  key={block.id}
                                  block={block}
                                  onClick={() => handleBlockClick(block)}
                                  overlapIndex={index}
                                  overlapTotal={totalBlocks}
                                  topOffset={getBlockSlotOffset(block.startTime, time)}
                                  column={layout.column}
                                  totalColumns={layout.totalColumns}
                                />
                              );
                            });
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Smart Suggestions — only on My Plan layer */}
            {selectedLayer === "personal" && (
              <SmartSuggestions
                eventBlocks={blocks.filter(b => b.type === "event")}
                personalBlocks={blocks.filter(b => b.type === "personal")}
                selectedDate={selectedDateStr}
                onEdit={(suggestion) => {
                  setAddSheetPrefill({
                    title: suggestion.title,
                    kind: suggestion.kind,
                    startTime: suggestion.startTime,
                    endTime: suggestion.endTime,
                    description: suggestion.subtitle,
                    isRecommendation: true,
                    recommendedPerson: suggestion.recommendedPerson,
                  });
                  setSelectedSlot(suggestion.startTime);
                  setAddSheetOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Block Bottom Sheet */}
      <AddBlockSheet
        isOpen={addSheetOpen}
        onClose={() => {
          setAddSheetOpen(false);
          setAddSheetPrefill(null);
        }}
        onAdd={handleAddBlock}
        selectedTime={selectedSlot || ""}
        prefill={addSheetPrefill}
      />

      {/* Event Detail Bottom Sheet */}
      <EventDetailSheet
        isOpen={detailSheetOpen}
        onClose={() => setDetailSheetOpen(false)}
        block={selectedBlock}
        onUpdate={handleUpdateBlock}
        onDelete={handleDeleteBlock}
        onAddToCalendar={handleAddToCalendar}
      />

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Floating Add Event Button */}
      <button
        onClick={() => {
          setSelectedSlot(currentTime >= "06:00" && currentTime <= "22:00" ? currentTime : "09:00");
          setAddSheetPrefill(null);
          setAddSheetOpen(true);
        }}
        className="fixed right-6 bottom-24 w-14 h-14 bg-[#0A7CFF] rounded-full flex items-center justify-center z-50 transition-transform active:scale-95"
        style={{
          boxShadow: '0 4px 12px rgba(10, 124, 255, 0.4)'
        }}
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>
    </div>
  );
}