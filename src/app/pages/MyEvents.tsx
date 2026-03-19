import { useNavigate } from "react-router";
import { ChevronLeft, Calendar, Users, MapPin, CalendarPlus } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCalendarEvents } from "../contexts/CalendarEventsContext";
import { useRef, useCallback } from "react";
import calendarIcon from "../../assets/a509444d307bff1e6d4d2f26a9a1a0314fcab961.png";
import { useGoBack } from "../hooks/useGoBack";

export default function MyEvents() {
  const navigate = useNavigate();
  const goBack = useGoBack("/calendar");
  const { registeredEvents } = useCalendarEvents();
  const navigatingRef = useRef(false);

  const handleCardClick = useCallback((eventId: string) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    navigate(`/event/${eventId}`, { state: { from: "/my-events" } });
    setTimeout(() => { navigatingRef.current = false; }, 500);
  }, [navigate]);

  const parseEventDate = (dateStr: string) => {
    const cleaned = dateStr.replace(/^\w+,\s*/, "");
    return new Date(cleaned);
  };

  const formatDate = (dateStr: string) => {
    const date = parseEventDate(dateStr);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      dayName: dayNames[date.getDay()],
      monthName: monthNames[date.getMonth()],
      date: date.getDate(),
      year: date.getFullYear()
    };
  };

  const getCalendarDateStr = (dateStr: string) => {
    const date = parseEventDate(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="bg-white min-h-screen font-['Open_Sans',sans-serif] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => goBack()}
              className="p-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
            </button>
            
            <h1 className="text-2xl font-['Rethink_Sans',sans-serif] font-bold text-[#0D1117]">My Events</h1>
            
            <div className="w-9" />
          </div>

          <p className="text-center text-sm font-['Open_Sans',sans-serif] text-[#718096]">
            Networking events you're attending
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto pt-36 pb-24 bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Summary Header */}
          <div className="mb-6 bg-white rounded-2xl p-5 border border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117]">
                  Total Events Planned
                </p>
                <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mt-1">
                  Upcoming year of networking
                </p>
              </div>
              <div className="text-right">
                <p className="font-['Rethink_Sans',sans-serif] text-3xl font-bold text-[#0A7CFF]">
                  {registeredEvents.length}
                </p>
              </div>
            </div>
          </div>

          {registeredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-[#E0F2FF] flex items-center justify-center mb-5">
                <CalendarPlus className="w-10 h-10 text-[#2E9BF5]" />
              </div>
              <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-2 text-center">
                No events yet
              </h2>
              <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] text-center mb-6 max-w-xs">
                Browse events and register to see them here. Your registered events will show up automatically.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3.5 bg-[#0A7CFF] text-white rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-colors"
              >
                Browse Matched Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredEvents.map((event) => {
                const formattedDate = formatDate(event.date);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => handleCardClick(event.eventId)}
                    className="block cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] active:scale-[0.98]">
                      <div className="w-full h-48 overflow-hidden">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-4">
                          {event.title}
                        </h2>

                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-[#0A7CFF]" />
                          <span className="font-['Open_Sans',sans-serif] text-base font-medium text-[#0D1117]">
                            {event.attendeeCount} Total Attendees
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#718096]" />
                            <span className="font-['Open_Sans',sans-serif] text-sm text-[#4A5568]">
                              {formattedDate.dayName}, {formattedDate.monthName} {formattedDate.date}, {formattedDate.year}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#718096]" />
                            <span className="font-['Open_Sans',sans-serif] text-sm text-[#4A5568]">
                              {event.location}
                            </span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] pb-3 border-b border-[#E2E8F0]">
                            {event.description}
                          </p>
                        )}

                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/calendar?date=${getCalendarDateStr(event.date)}`);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A7CFF] text-white rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-colors"
                          >
                            <img src={calendarIcon} alt="" className="w-5 h-5 object-contain" />
                            Go to Calendar
                          </button>
                          <div className="flex-1 py-2.5 bg-[#F7F8FA] text-[#4A5568] rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold text-center">
                            View Event Details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}