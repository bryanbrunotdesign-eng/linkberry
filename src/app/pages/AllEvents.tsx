import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useGoBack } from "../hooks/useGoBack";
import { EventCard } from "../components/EventCard";
import { BottomNav } from "../components/BottomNav";
import { allEvents } from "../data/events";

export default function AllEvents() {
  const navigate = useNavigate();
  const goBack = useGoBack("/");

  return (
    <div className="bg-white min-h-screen font-['Open_Sans',sans-serif] flex flex-col">
      <div className="bg-white border-b border-[#E2E8F0] fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => goBack()} className="p-2 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
            </button>
            <h1 className="text-2xl font-['Rethink_Sans',sans-serif] font-bold text-[#0D1117]">All Events</h1>
            <div className="w-9" />
          </div>
          <p className="text-center text-sm text-[#718096]">
            Browse all upcoming networking events
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-36 pb-24 bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            {allEvents.map((event) => (
              <EventCard key={event.id} {...event} variant="full-width" badge="upcoming" />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}