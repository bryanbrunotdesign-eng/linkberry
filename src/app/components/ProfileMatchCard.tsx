import { useNavigate, useLocation } from "react-router";
import { useCallback, useRef } from "react";
import { useConnections } from "../contexts/ConnectionsContext";

interface ProfileMatchCardProps {
  id?: string;
  imageUrl: string;
  name: string;
  matchPercentage: number;
  title: string;
  company: string;
  variant?: "default" | "full-width";
}

export function ProfileMatchCard({ id, imageUrl, name, matchPercentage, title, company, variant = "default" }: ProfileMatchCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigatingRef = useRef(false);
  const { getStatus, toggleConnection } = useConnections();
  const connectionStatus = id ? getStatus(id) : "none";
  const isTapped = connectionStatus === "pending";

  const handleNavigate = useCallback(() => {
    if (!id || navigatingRef.current) return;
    navigatingRef.current = true;
    navigate(`/profile/${id}`, { state: { from: location.pathname } });
    setTimeout(() => { navigatingRef.current = false; }, 500);
  }, [navigate, id, location.pathname]);

  if (variant === "full-width") {
    return (
      <div
        onClick={handleNavigate}
        className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] active:scale-[0.98] cursor-pointer"
      >
        <div className="p-5 flex gap-4 items-center">
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-['Rethink_Sans',sans-serif] text-lg font-bold text-[#0D1117] truncate flex-1">
                {name}
              </h4>
              <div className="bg-[#2E9BF5] rounded-full px-2.5 py-1 flex items-center justify-center flex-shrink-0">
                <span className="font-['Rethink_Sans',sans-serif] font-semibold text-xs text-white">
                  {matchPercentage}% match
                </span>
              </div>
            </div>
            <p className="font-['Open_Sans',sans-serif] text-sm text-[#0D1117] mb-0.5">
              {title}
            </p>
            <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096]">
              {company}
            </p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="w-full py-2.5 bg-[#0A7CFF] text-white rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold text-center active:scale-[0.97] transition-transform">
            View Profile
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cursor-pointer">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 min-w-[270px] active:scale-[0.98]">
        <div className="flex gap-3 mb-2">
          <div onClick={handleNavigate} className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover"
            />
          </div>
          <div onClick={handleNavigate} className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="font-['Rethink_Sans',sans-serif] font-bold text-sm text-[#0D1117]">
              {name}
            </h4>
            <p className="font-['Open_Sans',sans-serif] text-xs text-[#4A5568] truncate">
              {title}
            </p>
            <p className="font-['Open_Sans',sans-serif] text-[11px] text-[#718096] truncate">
              {company}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#2E9BF5] rounded-full px-4 py-1.5 flex items-center justify-center flex-1">
            <span className="font-['Rethink_Sans',sans-serif] font-semibold text-xs text-white leading-none">
              {matchPercentage}% match
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (id) toggleConnection(id);
            }}
            className={`px-4 py-1.5 rounded-xl font-['Open_Sans',sans-serif] text-xs font-semibold active:scale-95 transition-all flex-1 ${
              isTapped
                ? "bg-[#F7F8FA] text-[#0A7CFF] border border-[#0A7CFF]"
                : "bg-[#2E9BF5] text-white"
            }`}
          >
            {isTapped ? "\u2713 Tap Sent" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}