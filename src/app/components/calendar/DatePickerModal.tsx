import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useScrollLock } from "../../hooks/useScrollLock";
import { getAppToday } from "../../utils/appDate";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DatePickerModal({ isOpen, onClose, selectedDate, onDateSelect }: DatePickerModalProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  
  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setViewDate(new Date(selectedDate));
    }
  }, [isOpen, selectedDate]);
  
  if (!isOpen) return null;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  const handleMonthChange = (month: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(month);
    setViewDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(day);
    onDateSelect(newDate);
    onClose();
  };

  const getDaysInMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const days = getDaysInMonth();
  const isToday = (day: number) => {
    const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = getAppToday();
    return checkDate.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return checkDate.toDateString() === selectedDate.toDateString();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[100] ${
          isOpen ? 'opacity-20 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div className={`fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}>
        <div 
          className="bg-white rounded-3xl w-full max-w-md p-6 relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#718096]" />
          </button>

          <h2 className="font-['Rethink_Sans',sans-serif] font-bold text-xl text-[#0D1117] mb-6">
            Select Date
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-2 block">
                Month
              </label>
              <div className="relative">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#F7F8FA] border-none rounded-xl font-['Open_Sans',sans-serif] text-sm text-[#0D1117] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2E9BF5]"
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D1117] pointer-events-none rotate-90" />
              </div>
            </div>

            <div>
              <label className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-2 block">
                Year
              </label>
              <div className="relative">
                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#F7F8FA] border-none rounded-xl font-['Open_Sans',sans-serif] text-sm text-[#0D1117] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2E9BF5]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D1117] pointer-events-none rotate-90" />
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center">
                  <span className="font-['Open_Sans',sans-serif] text-xs font-medium text-[#A0AEC0]">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2" key={`${viewDate.getFullYear()}-${viewDate.getMonth()}`}>
              {days.map((day, index) => {
                const uniqueKey = day 
                  ? `${viewDate.getFullYear()}-${viewDate.getMonth()}-${day}`
                  : `empty-${index}`;
                
                return (
                  <div key={uniqueKey} className="aspect-square">
                    {day ? (
                      <button
                        onClick={() => handleDaySelect(day)}
                        className={`w-full h-full rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-colors ${
                          isSelected(day)
                            ? 'bg-[#0A7CFF] text-white'
                            : isToday(day)
                            ? 'bg-[#E0F2FF] text-[#0A7CFF]'
                            : 'text-[#0D1117]'
                        }`}
                      >
                        {day}
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex gap-3">
            <button
              onClick={() => {
                const today = getAppToday();
                setViewDate(today);
                onDateSelect(today);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 bg-[#F7F8FA] rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117] transition-colors"
            >
              Today
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-[#0A7CFF] rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}