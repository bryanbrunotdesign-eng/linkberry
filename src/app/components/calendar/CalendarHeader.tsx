import { Clock, Calendar, User, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { CalendarBlockData } from "../../pages/Calendar";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DatePickerModal } from "./DatePickerModal";
import { getAppToday } from "../../utils/appDate";

interface CalendarHeaderProps {
  onBackClick: () => void;
  selectedLayer: "event" | "personal";
  onLayerChange: (layer: "event" | "personal") => void;
  eventBlocks?: CalendarBlockData[];
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
}

export function CalendarHeader({ onBackClick, selectedLayer, onLayerChange, eventBlocks, onDateChange, initialDate }: CalendarHeaderProps) {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // today is ALWAYS the real current date — never changes when a date is selected
  const today = getAppToday();
  const [selectedDate, setSelectedDate] = useState(initialDate || today);

  const handleDateSelect = (date: Date) => {
    // Only update the selected date — chevrons handle week navigation separately
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const goToPrevWeek = () => setWeekOffset(w => w - 1);
  const goToNextWeek = () => setWeekOffset(w => w + 1);

  // Calculate the week to display based on weekOffset from real today
  const getWeekDays = () => {
    // Start from real today, then jump by weekOffset weeks
    const base = new Date(today);
    base.setDate(today.getDate() + weekOffset * 7);

    // Find Sunday of that week
    const sunday = new Date(base);
    sunday.setDate(base.getDate() - base.getDay());

    const days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push({
        day: dayNames[i],
        date: date.getDate(),
        fullDate: date,
        isToday,
        isSelected,
      });
    }

    return days;
  };

  const weekDays = getWeekDays();

  const layerOptions = [
    { value: "event" as const, label: "Event Agenda" },
    { value: "personal" as const, label: "My Plan" }
  ];

  const getTotalAttendees = () => {
    if (!eventBlocks || selectedLayer !== "event") return 0;
    const eventAgendaBlocks = eventBlocks.filter(b => b.type === "event");
    let total = 0;
    eventAgendaBlocks.forEach(block => {
      if (block.attendees && block.attendees.length > 0) {
        const attendeeStr = block.attendees[0];
        const match = attendeeStr.match(/(\d+)/);
        if (match) total += parseInt(match[1]);
      }
    });
    return total;
  };

  const hasEventsOnSelectedDate = () => {
    if (!eventBlocks || selectedLayer !== "event") return false;
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    return eventBlocks.some(b => b.type === "event" && b.date === dateStr);
  };

  const getEventName = () => {
    if (!eventBlocks) return "";
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    const dayBlocks = eventBlocks.filter(b => b.type === "event" && b.date === dateStr);
    if (dayBlocks.length === 0) return "";

    // Collect unique event titles for this day
    const uniqueTitles = new Set(
      dayBlocks.map(b => b.eventTitle || b.title).filter(Boolean)
    );
    if (uniqueTitles.size > 1) {
      return `${uniqueTitles.size} Events Today`;
    }
    // Single event — use eventTitle if available, else first block title
    return dayBlocks[0].eventTitle || dayBlocks[0].title;
  };

  const getDisplayDate = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return {
      dayName: dayNames[selectedDate.getDay()],
      monthName: monthNames[selectedDate.getMonth()],
      date: selectedDate.getDate(),
      year: selectedDate.getFullYear()
    };
  };

  const displayDate = getDisplayDate();

  return (
    <div className="bg-white border-b border-[#E2E8F0] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-1">
            <button 
              onClick={() => navigate("/my-events")}
              className="p-2 bg-white border border-[#E2E8F0] rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#4A5568]" />
            </button>
          </div>

          <button 
            onClick={() => setIsDatePickerOpen(true)}
            className="text-center flex-1 cursor-pointer transition-opacity"
          >
            <h1 className="text-2xl sm:text-3xl font-['Rethink_Sans',sans-serif] font-bold text-[#0D1117]">
              {displayDate.dayName}
            </h1>
            <p className="text-sm font-['Open_Sans',sans-serif] text-[#A0AEC0]">
              {displayDate.monthName} {displayDate.date}, {displayDate.year}
            </p>
          </button>

          <div className="flex justify-end flex-1">
            <button 
              onClick={onBackClick}
              className="p-2 bg-white border border-[#E2E8F0] rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-[#4A5568]" />
            </button>
          </div>
        </div>

        {/* Week View — chevrons on both sides control week navigation only */}
        <div className="flex items-center justify-between gap-1">
          <button
            className="p-1.5 rounded-xl bg-[#F7F8FA] active:bg-[#E2E8F0] transition-colors flex-shrink-0"
            onClick={goToPrevWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
          </button>

          <div className="flex items-center justify-between flex-1">
            {weekDays.map((item, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(item.fullDate)}
                className="flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-colors active:scale-95"
              >
                {/* Day letter */}
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                  item.isSelected ? 'text-[#0A7CFF]' : 'text-[#A0AEC0]'
                }`}>
                  {item.day}
                </span>

                {/* Date number pill */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                  item.isSelected
                    ? 'bg-[#0A7CFF] text-white shadow-md'
                    : item.isToday
                    ? 'bg-[#E8F2FF] text-[#0A7CFF]'
                    : 'text-[#0D1117]'
                }`}>
                  {item.date}
                </div>

                {/* Today dot indicator */}
                <div className={`w-1 h-1 rounded-full transition-all ${
                  item.isToday && !item.isSelected ? 'bg-[#0A7CFF]' : 'bg-transparent'
                }`} />
              </button>
            ))}
          </div>

          <button
            className="p-1.5 rounded-xl bg-[#F7F8FA] active:bg-[#E2E8F0] transition-colors flex-shrink-0"
            onClick={goToNextWeek}
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5 text-[#0D1117]" />
          </button>
        </div>

        {/* Layer Selector */}
        <div className="mt-4">
          <div className="bg-[#F7F8FA] rounded-2xl p-1 flex gap-1">
            {layerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onLayerChange(option.value)}
                className={`flex-1 py-2.5 px-4 rounded-2xl font-['Open_Sans',sans-serif] text-sm transition-all ${
                  selectedLayer === option.value
                    ? option.value === "event"
                      ? 'bg-[#0A7CFF] text-white font-semibold'
                      : 'bg-[#FF5C3A] text-white font-semibold'
                    : 'bg-transparent text-[#A0AEC0] font-normal'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedLayer === "event" && hasEventsOnSelectedDate() && (
              <motion.div
                key="event-info"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-3 overflow-hidden"
              >
                <div className="px-4 py-3 bg-[#F7F8FA] rounded-2xl">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-['Open_Sans',sans-serif] font-semibold text-sm text-[#0D1117]">
                      {getEventName()}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0A7CFF]" />
                      <span className="font-['Open_Sans',sans-serif] text-xs text-[#718096]">
                        {getTotalAttendees().toLocaleString()}+ Total Attendees
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}