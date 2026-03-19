import { useState, useMemo } from "react";
import { CalendarBlockData, BlockKind } from "../../pages/Calendar";
import { Plus, Minus, Users, Coffee, FileText, Zap, MessageCircle, Brain, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { recommendedPeople } from "../../data/events";

export interface SuggestionPerson {
  id: string;
  name: string;
  title: string;
  company: string;
  imageUrl: string;
  matchPercentage: number;
}

interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
  kind: BlockKind;
  startTime: string;
  endTime: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  recommendedPerson?: SuggestionPerson;
}

interface SmartSuggestionsProps {
  eventBlocks: CalendarBlockData[];
  personalBlocks: CalendarBlockData[];
  selectedDate: string;
  onEdit: (suggestion: Suggestion) => void;
  onDismiss?: (id: string) => void;
}

// Pool of suggestion templates keyed by gap context
const suggestionTemplates: {
  kind: BlockKind;
  title: string;
  subtitle: string;
  icon: (cls: string) => React.ReactNode;
  accentColor: string;
  bgColor: string;
  minGapMinutes: number;
  contexts: ("before-event" | "after-event" | "between-events" | "morning" | "afternoon")[];
}[] = [
  {
    kind: "meetup",
    title: "Have a 1-on-1",
    subtitle: "Great time to connect with a match",
    icon: (cls) => <Users className={cls} />,
    accentColor: "#FF5C3A",
    bgColor: "rgba(255, 92, 58, 0.06)",
    minGapMinutes: 30,
    contexts: ["between-events", "morning", "afternoon"],
  },
  {
    kind: "personal-break",
    title: "Take a break",
    subtitle: "Recharge before your next session",
    icon: (cls) => <Coffee className={cls} />,
    accentColor: "#718096",
    bgColor: "rgba(160, 174, 192, 0.08)",
    minGapMinutes: 15,
    contexts: ["between-events", "after-event"],
  },
  {
    kind: "note",
    title: "Prep for next session",
    subtitle: "Review speakers and talking points",
    icon: (cls) => <FileText className={cls} />,
    accentColor: "#C9963A",
    bgColor: "rgba(240, 200, 117, 0.10)",
    minGapMinutes: 20,
    contexts: ["before-event"],
  },
  {
    kind: "meetup",
    title: "Quick coffee chat",
    subtitle: "15 min catch-up with a connection",
    icon: (cls) => <MessageCircle className={cls} />,
    accentColor: "#FF8C6B",
    bgColor: "rgba(255, 140, 107, 0.08)",
    minGapMinutes: 15,
    contexts: ["between-events", "morning"],
  },
  {
    kind: "note",
    title: "Reflect & take notes",
    subtitle: "Jot down key takeaways",
    icon: (cls) => <Brain className={cls} />,
    accentColor: "#0A7CFF",
    bgColor: "rgba(10, 124, 255, 0.06)",
    minGapMinutes: 15,
    contexts: ["after-event"],
  },
  {
    kind: "meetup",
    title: "Introduce yourself",
    subtitle: "Reach out to someone new nearby",
    icon: (cls) => <Zap className={cls} />,
    accentColor: "#FF5C3A",
    bgColor: "rgba(255, 92, 58, 0.06)",
    minGapMinutes: 20,
    contexts: ["morning", "afternoon"],
  },
];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function SmartSuggestions({
  eventBlocks,
  personalBlocks,
  selectedDate,
  onEdit,
}: SmartSuggestionsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    // Get event blocks for this date sorted by start time
    const dayEvents = eventBlocks
      .filter((b) => b.date === selectedDate)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    if (dayEvents.length === 0) return [];

    // Find gaps between events (and before first / after last)
    interface Gap {
      startTime: string;
      endTime: string;
      durationMinutes: number;
      context: "before-event" | "after-event" | "between-events" | "morning" | "afternoon";
    }

    const gaps: Gap[] = [];

    // Gap before first event (if after 7 AM)
    const firstStart = timeToMinutes(dayEvents[0].startTime);
    if (firstStart > 7 * 60) {
      const gapStart = Math.max(7 * 60, firstStart - 60);
      gaps.push({
        startTime: minutesToTime(gapStart),
        endTime: dayEvents[0].startTime,
        durationMinutes: firstStart - gapStart,
        context: firstStart < 12 * 60 ? "morning" : "before-event",
      });
    }

    // Gaps between events
    for (let i = 0; i < dayEvents.length - 1; i++) {
      const endOfCurrent = timeToMinutes(dayEvents[i].endTime);
      const startOfNext = timeToMinutes(dayEvents[i + 1].startTime);
      if (startOfNext - endOfCurrent >= 15) {
        gaps.push({
          startTime: dayEvents[i].endTime,
          endTime: dayEvents[i + 1].startTime,
          durationMinutes: startOfNext - endOfCurrent,
          context: "between-events",
        });
      }
    }

    // Gap after last event (if before 8 PM)
    const lastEnd = timeToMinutes(dayEvents[dayEvents.length - 1].endTime);
    if (lastEnd < 20 * 60) {
      const gapEnd = Math.min(20 * 60, lastEnd + 60);
      gaps.push({
        startTime: dayEvents[dayEvents.length - 1].endTime,
        endTime: minutesToTime(gapEnd),
        durationMinutes: gapEnd - lastEnd,
        context: lastEnd < 12 * 60 ? "morning" : lastEnd >= 17 * 60 ? "afternoon" : "after-event",
      });
    }

    // Generate suggestions from gaps
    const result: Suggestion[] = [];
    let templateIdx = 0;
    let meetupPersonIdx = 0; // Rotate through recommended people for meetup suggestions

    for (const gap of gaps) {
      // Check if there's already a personal block in this gap
      const gapStart = timeToMinutes(gap.startTime);
      const gapEnd = timeToMinutes(gap.endTime);
      const hasPersonalBlock = personalBlocks.some((b) => {
        if (b.date !== selectedDate) return false;
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return bStart < gapEnd && bEnd > gapStart;
      });
      if (hasPersonalBlock) continue;

      // Find a matching template
      const matchingTemplates = suggestionTemplates.filter(
        (t) =>
          t.minGapMinutes <= gap.durationMinutes &&
          t.contexts.includes(gap.context)
      );

      if (matchingTemplates.length === 0) continue;

      // Pick one (rotate through for variety)
      const template = matchingTemplates[templateIdx % matchingTemplates.length];
      templateIdx++;

      // Suggest a block that fits in the gap (max 30 min)
      const suggestionDuration = Math.min(30, gap.durationMinutes);
      // Center the suggestion in the gap
      const offset = Math.floor((gap.durationMinutes - suggestionDuration) / 2);
      const startMinutes = gapStart + offset;
      const endMinutes = startMinutes + suggestionDuration;

      const id = `suggestion-${gap.startTime}-${template.kind}`;

      // Assign a unique recommended person for meetup-type suggestions
      let recommendedPerson: SuggestionPerson | undefined;
      if (template.kind === "meetup" && recommendedPeople.length > 0) {
        const person = recommendedPeople[meetupPersonIdx % recommendedPeople.length];
        meetupPersonIdx++;
        recommendedPerson = {
          id: person.id,
          name: person.name,
          title: person.title,
          company: person.company,
          imageUrl: person.imageUrl,
          matchPercentage: person.matchPercentage,
        };
      }

      result.push({
        id,
        title: template.title,
        subtitle: template.subtitle,
        kind: template.kind,
        startTime: minutesToTime(startMinutes),
        endTime: minutesToTime(endMinutes),
        icon: template.icon("w-4 h-4"),
        accentColor: template.accentColor,
        bgColor: template.bgColor,
        recommendedPerson,
      });
    }

    // Limit to 3 suggestions max
    return result.slice(0, 3);
  }, [eventBlocks, personalBlocks, selectedDate]);

  const visibleSuggestions = suggestions.filter(
    (s) => !dismissedIds.has(s.id)
  );

  if (visibleSuggestions.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const handleAdd = (suggestion: Suggestion) => {
    onEdit(suggestion);
  };

  return (
    <>
      {visibleSuggestions.map((suggestion) => {
        // Calculate position in grid
        const startMinutes = timeToMinutes(suggestion.startTime);
        const gridStartMinutes = 6 * 60; // 6 AM
        const topPx = ((startMinutes - gridStartMinutes) / 30) * 72;
        const durationMinutes =
          timeToMinutes(suggestion.endTime) - startMinutes;
        const heightPx = (durationMinutes / 30) * 72;

        return (
          <AnimatePresence key={suggestion.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute z-15 pointer-events-auto"
              style={{
                top: `${topPx + 4}px`,
                left: "68px",
                right: "4px",
                height: `${heightPx - 8}px`,
                minHeight: "56px",
              }}
            >
              <div
                className="w-full h-full rounded-2xl border-2 border-dashed flex flex-col justify-center px-2.5 py-1.5 overflow-hidden"
                style={{
                  borderColor: suggestion.accentColor,
                  backgroundColor: suggestion.bgColor,
                  opacity: 0.85,
                }}
              >
                {/* Recommended badge — sits above the main row */}
                <span
                  className="self-start inline-flex items-center gap-0.5 px-1.5 py-px rounded-full text-[8px] font-semibold font-['Open_Sans',sans-serif] uppercase tracking-wider whitespace-nowrap mb-1"
                  style={{
                    color: suggestion.accentColor,
                    backgroundColor: suggestion.accentColor + "15",
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Recommended
                </span>

                {/* Main content row */}
                <div className="flex items-center gap-2">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: suggestion.accentColor + "18",
                      color: suggestion.accentColor,
                    }}
                  >
                    {suggestion.icon}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-['Open_Sans',sans-serif] text-[13px] font-semibold truncate"
                      style={{ color: "#0D1117" }}
                    >
                      {suggestion.title}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(suggestion);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                      style={{
                        backgroundColor: suggestion.accentColor,
                      }}
                    >
                      <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(suggestion.id);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-[#F7F8FA] border border-[#E2E8F0] transition-all active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#718096]" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </>
  );
}