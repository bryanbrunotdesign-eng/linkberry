import { useNavigate } from "react-router";
import { getAppToday } from "../utils/appDate";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function TodaySchedule() {
  const navigate = useNavigate();
  const today = getAppToday();
  const dayName = DAY_NAMES[today.getDay()];
  const dayNum = today.getDate();

  return (
    <div className="bg-[#1E2A3A] rounded-2xl p-4 border border-[#E2E8F0]">
      <div className="flex items-start mb-4 gap-4">
        <div className="flex flex-col gap-2 flex-shrink-0">
          <h2 className="font-['Rethink_Sans',sans-serif] font-semibold text-[22px] text-white leading-tight">
            Today
          </h2>
          <div className="bg-[#0A7CFF] rounded-lg w-10 h-10 flex flex-col items-center justify-center">
            <span className="font-['Open_Sans',sans-serif] font-bold text-[7px] text-white/80 uppercase tracking-wide leading-none">{dayName}</span>
            <span className="font-['Rethink_Sans',sans-serif] font-semibold text-[20px] text-white leading-none">{dayNum}</span>
          </div>
        </div>
        <div className="w-px self-stretch bg-white/20 mx-1" />
        <div className="flex-1 flex flex-col gap-3.5 pt-0.5">
          <div>
            <p className="font-['Rethink_Sans',sans-serif] font-medium text-[13px] text-white truncate">
              2PM <span className="text-white/40 mx-0.5">–</span> 4PM
            </p>
            <p className="font-['Open_Sans',sans-serif] font-normal text-xs text-white/60 truncate">Michael Chen @DesignSprints</p>
          </div>
          <div>
            <p className="font-['Rethink_Sans',sans-serif] font-medium text-[13px] text-white truncate">
              6PM <span className="text-white/40 mx-0.5">–</span> 9PM
            </p>
            <p className="font-['Open_Sans',sans-serif] font-normal text-xs text-white/60 truncate">AI Revolution Summit 2024</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate("/calendar")}
        className="w-full flex items-center justify-between pt-1"
      >
        <span className="font-['Open_Sans',sans-serif] font-semibold text-sm text-white">
          Open Calendar
        </span>
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
        >
          <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}