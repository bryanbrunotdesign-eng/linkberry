import { useNavigate, useLocation } from "react-router";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isKeyboardVisible = useKeyboardVisible();

  if (isKeyboardVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-4 pb-safe z-50">
      <div className="flex items-center justify-around max-w-md mx-auto py-3">
        <NavItem icon="home" label="Home" active={location.pathname === "/"} onClick={() => navigate("/")} />
        <NavItem icon="my-events" label="My Events" active={location.pathname === "/my-events"} onClick={() => navigate("/my-events")} />
        <NavItem icon="calendar" label="Calendar" active={location.pathname === "/calendar"} onClick={() => navigate("/calendar")} />
        <NavItem icon="chat" label="Chats" active={location.pathname === "/chats"} onClick={() => navigate("/chats")} />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button className="flex flex-col items-center gap-1" onClick={onClick}>
      <div className={`${active ? 'bg-[#0A7CFF]/10' : ''} rounded-full p-1.5`}>
        {icon === 'home' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12h6v10" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {icon === 'my-events' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {icon === 'calendar' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="14" r="1" fill={active ? "#0A7CFF" : "#0D1117"} />
            <circle cx="12" cy="14" r="1" fill={active ? "#0A7CFF" : "#0D1117"} />
            <circle cx="16" cy="14" r="1" fill={active ? "#0A7CFF" : "#0D1117"} />
            <circle cx="8" cy="18" r="1" fill={active ? "#0A7CFF" : "#0D1117"} />
            <circle cx="12" cy="18" r="1" fill={active ? "#0A7CFF" : "#0D1117"} />
          </svg>
        )}
        {icon === 'chat' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" stroke={active ? "#0A7CFF" : "#0D1117"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`font-['Open_Sans',sans-serif] text-[10px] ${active ? 'font-bold text-[#0A7CFF]' : 'text-[#0D1117]'}`}>
        {label}
      </span>
    </button>
  );
}