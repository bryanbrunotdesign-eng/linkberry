import { CalendarBlockData } from "../../pages/Calendar";
import { Users, Mic, Coffee, Briefcase, Video, Zap, FileText, Pause, UsersRound } from "lucide-react";

interface CalendarBlockProps {
  block: CalendarBlockData;
  onClick?: (block: CalendarBlockData) => void;
  overlapIndex?: number;
  overlapTotal?: number;
  topOffset?: number;
  column?: number;
  totalColumns?: number;
}

// Color system based on block type and kind — Teal/Blue for events, Coral for personal
const getBlockStyles = (type: "event" | "personal", kind: string) => {
  if (type === "event") {
    switch (kind) {
      case "speaker":
        return {
          borderColor: "#2E9BF5",
          backgroundColor: "rgba(46, 155, 245, 0.1)",
          textColor: "#0D1117",
          timeColor: "#2E9BF5",
          accentColor: "#2E9BF5"
        };
      case "panel":
        return {
          borderColor: "#0057B8",
          backgroundColor: "rgba(0, 87, 184, 0.08)",
          textColor: "#0D1117",
          timeColor: "#0057B8",
          accentColor: "#0057B8"
        };
      case "workshop":
        return {
          borderColor: "#7BC8FF",
          backgroundColor: "rgba(123, 200, 255, 0.15)",
          textColor: "#0D1117",
          timeColor: "#0A7CFF",
          accentColor: "#0A7CFF"
        };
      case "break":
        return {
          borderColor: "#A0AEC0",
          backgroundColor: "#F7F8FA",
          textColor: "#0D1117",
          timeColor: "#718096",
          accentColor: "#718096"
        };
      default:
        return {
          borderColor: "#2E9BF5",
          backgroundColor: "rgba(46, 155, 245, 0.1)",
          textColor: "#0D1117",
          timeColor: "#2E9BF5",
          accentColor: "#2E9BF5"
        };
    }
  } else {
    switch (kind) {
      case "meetup":
        return {
          borderColor: "#FF5C3A",
          backgroundColor: "rgba(255, 92, 58, 0.15)",
          textColor: "#0D1117",
          timeColor: "#FF5C3A",
          accentColor: "#FF5C3A"
        };
      case "group":
        return {
          borderColor: "#FF8C6B",
          backgroundColor: "rgba(255, 140, 107, 0.15)",
          textColor: "#0D1117",
          timeColor: "#FF5C3A",
          accentColor: "#FF8C6B"
        };
      case "note":
        return {
          borderColor: "#F0C875",
          backgroundColor: "rgba(240, 200, 117, 0.2)",
          textColor: "#0D1117",
          timeColor: "#C9963A",
          accentColor: "#C9963A"
        };
      case "personal-break":
        return {
          borderColor: "#A0AEC0",
          backgroundColor: "rgba(247, 248, 250, 0.5)",
          textColor: "#0D1117",
          timeColor: "#718096",
          accentColor: "#718096"
        };
      case "focus":
        return {
          borderColor: "#FF5C3A",
          backgroundColor: "rgba(255, 92, 58, 0.15)",
          textColor: "#0D1117",
          timeColor: "#FF5C3A",
          accentColor: "#FF5C3A"
        };
      default:
        return {
          borderColor: "#FF5C3A",
          backgroundColor: "rgba(255, 92, 58, 0.15)",
          textColor: "#0D1117",
          timeColor: "#FF5C3A",
          accentColor: "#FF5C3A"
        };
    }
  }
};

const getIcon = (type: "event" | "personal", kind: string) => {
  const iconClass = "w-5 h-5";
  if (type === "event") {
    switch (kind) {
      case "speaker": return <Mic className={iconClass} />;
      case "panel": return <Users className={iconClass} />;
      case "workshop": return <Briefcase className={iconClass} />;
      case "break": return <Coffee className={iconClass} />;
      default: return <Mic className={iconClass} />;
    }
  } else {
    switch (kind) {
      case "meetup": return <Users className={iconClass} />;
      case "group": return <UsersRound className={iconClass} />;
      case "note": return <FileText className={iconClass} />;
      case "personal-break": return <Pause className={iconClass} />;
      case "focus": return <Zap className={iconClass} />;
      default: return <Users className={iconClass} />;
    }
  }
};

export function CalendarBlock({ block, onClick, overlapIndex = 0, overlapTotal = 1, topOffset = 0, column, totalColumns }: CalendarBlockProps) {
  const calculateHeight = () => {
    const [startHour, startMin] = block.startTime.split(":").map(Number);
    const [endHour, endMin] = block.endTime.split(":").map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return (durationMinutes / 30) * 72;
  };

  const height = calculateHeight();
  const styles = getBlockStyles(block.type, block.kind);
  const isEvent = block.type === "event";
  const isPersonal = block.type === "personal";
  const isCompact = height <= 72;

  // Use the new column/totalColumns from the full-range layout algorithm when provided,
  // otherwise fall back to the old per-slot overlapIndex/overlapTotal
  const layoutCol = column ?? overlapIndex;
  const layoutTotal = totalColumns ?? overlapTotal;

  const hasOverlap = layoutTotal > 1;
  const blockWidth = hasOverlap ? `${100 / layoutTotal}%` : '100%';
  const blockLeft = hasOverlap ? `${(layoutCol / layoutTotal) * 100}%` : '0px';
  const horizontalPadding = '4px';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(block);
      }}
      className={`absolute rounded-2xl transition-all duration-200 text-left border-2 border-dashed ${
        isCompact ? 'px-2.5 py-1.5' : 'p-3'
      } ${
        isEvent ? 'z-10' : 'z-20'
      }`}
      style={{ 
        height: `${height - 8}px`,
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        top: `${4 + topOffset}px`,
        left: hasOverlap ? `calc(${horizontalPadding} + ${blockLeft})` : horizontalPadding,
        width: hasOverlap ? `calc(${blockWidth} - ${horizontalPadding} * 2)` : `calc(100% - ${horizontalPadding} * 2)`,
        maxWidth: hasOverlap ? `calc(${blockWidth} - ${horizontalPadding} * 2)` : `calc(100% - ${horizontalPadding} * 2)`,
        opacity: 1
      }}
    >
      {isCompact ? (
        /* Compact single-row layout for 30-min blocks */
        <div className="flex items-center gap-2 h-full">
          <div style={{ color: styles.accentColor }} className="flex-shrink-0">
            {getIcon(block.type, block.kind)}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-['Open_Sans',sans-serif] font-semibold text-[13px] leading-tight truncate"
              style={{ color: styles.textColor }}
            >
              {block.title}
            </h3>
            <span
              className="font-['Rethink_Sans',sans-serif] text-[11px]"
              style={{ color: styles.timeColor }}
            >
              {formatTime(block.startTime)} – {formatTime(block.endTime)}
            </span>
          </div>
        </div>
      ) : (
        /* Standard multi-row layout */
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-2 mb-1">
            <div style={{ color: styles.accentColor }} className="mt-0.5 flex-shrink-0">
              {getIcon(block.type, block.kind)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className={`font-['Open_Sans',sans-serif] font-semibold leading-tight line-clamp-2 ${
                  hasOverlap ? 'text-base' : 'text-lg'
                }`}
                style={{ color: styles.textColor }}
              >
                {block.title}
              </h3>
            </div>
          </div>

          <div 
            className={`font-['Rethink_Sans',sans-serif] font-normal mt-1 ${
              hasOverlap ? 'text-xs' : 'text-sm'
            }`}
            style={{ color: styles.timeColor }}
          >
            {formatTime(block.startTime)} - {formatTime(block.endTime)}
          </div>

          {block.description && height > 140 && !hasOverlap && (
            <p 
              className="font-['Open_Sans',sans-serif] text-sm font-normal text-[#A0AEC0] mt-2 line-clamp-2"
            >
              {block.description}
            </p>
          )}

          {isEvent && block.matchesAttending !== undefined && height > (hasOverlap ? 100 : 140) && (
            <div className="mt-auto pt-2">
              <div className="flex items-center gap-1.5">
                <Users className={hasOverlap ? "w-3 h-3" : "w-3.5 h-3.5"} style={{ color: styles.accentColor }} />
                <span 
                  className={`font-['Open_Sans',sans-serif] font-medium ${
                    hasOverlap ? 'text-[10px]' : 'text-xs'
                  }`}
                  style={{ color: styles.accentColor }}
                >
                  {block.matchesAttending} {block.matchesAttending === 1 ? 'match' : 'matches'}
                </span>
              </div>
            </div>
          )}

          {isPersonal && block.attendees && height > 140 && (
            <div className="mt-auto pt-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3" style={{ color: styles.accentColor }} />
                <span 
                  className="font-['Open_Sans',sans-serif] text-xs truncate"
                  style={{ color: styles.accentColor }}
                >
                  {block.attendees.join(", ")}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}