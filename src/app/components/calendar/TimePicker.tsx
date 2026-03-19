import { useRef, useEffect, useCallback, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const pillRef = useRef<HTMLDivElement>(null);
  const accumulatedDelta = useRef(0);
  const SCROLL_THRESHOLD = 30;
  const [isDragging, setIsDragging] = useState(false);

  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  };

  const minutesToTime = (totalMinutes: number): string => {
    const clamped = Math.max(0, Math.min(totalMinutes, 23 * 60 + 45));
    const hours = Math.floor(clamped / 60) % 24;
    const minutes = clamped % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const roundToNearestInterval = (totalMinutes: number): number => {
    return Math.round(totalMinutes / 15) * 15;
  };

  useEffect(() => {
    const currentMinutes = timeToMinutes(value);
    const roundedMinutes = roundToNearestInterval(currentMinutes);
    if (currentMinutes !== roundedMinutes) {
      onChange(minutesToTime(roundedMinutes));
    }
  }, [value]);

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr || !timeStr.includes(':')) return '12:00 AM';
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '12:00 AM';
    const isPM = hours >= 12;
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const period = isPM ? "PM" : "AM";
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  const stepTime = useCallback((direction: 1 | -1) => {
    const currentMinutes = timeToMinutes(valueRef.current);
    const newMinutes = currentMinutes + direction * 15;
    onChangeRef.current(minutesToTime(newMinutes));
  }, []);

  // Handle wheel events on the pill
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    accumulatedDelta.current += e.deltaY;

    if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
      const steps = Math.sign(accumulatedDelta.current) as 1 | -1;
      accumulatedDelta.current = 0;
      stepTime(steps);
    }
  }, [stepTime]);

  // Handle touch-based scrolling on the pill
  const touchStartY = useRef<number | null>(null);
  const touchAccumulated = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    touchStartY.current = e.touches[0].clientY;
    touchAccumulated.current = 0;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchStartY.current === null) return;
    e.preventDefault();
    e.stopPropagation();

    const currentY = e.touches[0].clientY;
    const delta = touchStartY.current - currentY;
    touchStartY.current = currentY;
    touchAccumulated.current += delta;

    const TOUCH_THRESHOLD = 20;
    if (Math.abs(touchAccumulated.current) >= TOUCH_THRESHOLD) {
      const steps = Math.sign(touchAccumulated.current) as 1 | -1;
      touchAccumulated.current = 0;
      stepTime(steps);
    }
  }, [stepTime]);

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null;
    touchAccumulated.current = 0;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className="relative">
      <label className="block font-['Open_Sans',sans-serif] text-xs font-medium text-[#718096] mb-2 uppercase tracking-wide">
        {label}
      </label>

      <div className="flex flex-col items-center gap-1">
        {/* Up button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); stepTime(-1); }}
          className="w-full flex items-center justify-center py-1 rounded-lg active:bg-[#E2E8F0] transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-[#718096]" />
        </button>

        {/* Time display — still supports swipe/scroll */}
        <div
          ref={pillRef}
          className={`w-full px-4 py-3 bg-[#F7F8FA] rounded-xl font-['Rethink_Sans',sans-serif] text-[#0D1117] text-center font-semibold select-none cursor-ns-resize transition-colors ${
            isDragging ? 'bg-[#E2E8F0]' : ''
          }`}
          style={{ touchAction: 'none' }}
        >
          {formatDisplayTime(value)}
        </div>

        {/* Down button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); stepTime(1); }}
          className="w-full flex items-center justify-center py-1 rounded-lg active:bg-[#E2E8F0] transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-[#718096]" />
        </button>
      </div>
    </div>
  );
}