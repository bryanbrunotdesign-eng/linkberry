import { useNavigate, useLocation } from "react-router";
import { useCallback, useRef } from "react";

interface EventCardProps {
  id?: string;
  imageUrl: string;
  organizer: string;
  title: string;
  date: string;
  time: string;
  variant?: "default" | "full-width";
  badge?: "recommended" | "upcoming";
}

export function EventCard({ id = "1", imageUrl, organizer, title, date, time, variant = "default", badge }: EventCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigatingRef = useRef(false);

  const handleNavigate = useCallback(() => {
    // Prevent duplicate navigations
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    navigate(`/event/${id}`, { state: { from: location.pathname } });
    // Reset after a short delay
    setTimeout(() => {
      navigatingRef.current = false;
    }, 500);
  }, [navigate, id, location.pathname]);

  if (variant === "full-width") {
    return (
      <div
        onClick={handleNavigate}
        className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] active:scale-[0.98] cursor-pointer"
      >
        {/* Event Image */}
        <div className="w-full h-48 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {badge && (
            <span
              className={`absolute top-3 right-3 px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-xs font-semibold backdrop-blur-sm shadow-sm ${
                badge === "recommended"
                  ? "bg-[#FF5C3A]/90 text-white"
                  : "bg-[#0A7CFF]/90 text-white"
              }`}
            >
              {badge === "recommended" ? "Recommended" : "Upcoming"}
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-1">
            {organizer}
          </p>
          <h4 className="font-['Rethink_Sans',sans-serif] text-lg font-semibold text-[#0D1117] mb-3">
            {title}
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#718096" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#718096" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-['Open_Sans',sans-serif] text-sm text-[#4A5568]">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" stroke="#718096" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Rethink_Sans',sans-serif] text-sm text-[#4A5568]">
                {time}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 w-full py-2.5 bg-[#F7F8FA] text-[#4A5568] rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold text-center">
            View Event Details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleNavigate} className="cursor-pointer">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 flex gap-3 min-w-[270px] active:scale-[0.98]">
        <div className="relative flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-20 h-20 rounded-xl object-cover"
          />
          {badge && (
            <span
              className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full font-['Open_Sans',sans-serif] text-[8px] font-semibold backdrop-blur-sm shadow-sm ${
                badge === "recommended"
                  ? "bg-[#FF5C3A]/90 text-white"
                  : "bg-[#0A7CFF]/90 text-white"
              }`}
            >
              {badge === "recommended" ? "Rec'd" : "Soon"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-['Open_Sans',sans-serif] text-[9px] text-[#718096] mb-1 truncate">
            {organizer}
          </p>
          <h4 className="font-['Rethink_Sans',sans-serif] font-bold text-sm text-[#0D1117] mb-1 line-clamp-2">
            {title}
          </h4>
          <div className="font-['Rethink_Sans',sans-serif] text-[11px] text-[#4A5568]">
            <p className="mb-0 truncate">{date}</p>
            <p className="truncate">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}