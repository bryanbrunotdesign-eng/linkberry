interface MatchConnectButtonProps {
  personId: string;
  getStatus: (id: string) => "none" | "pending" | "connected";
  toggleConnection: (id: string) => void;
}

export function MatchConnectButton({ personId, getStatus, toggleConnection }: MatchConnectButtonProps) {
  const status = getStatus(personId);
  const isTapped = status === "pending";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleConnection(personId);
      }}
      className={`px-4 py-1.5 rounded-xl font-['Open_Sans',sans-serif] text-xs font-semibold active:scale-95 transition-all ${
        isTapped
          ? "bg-[#F7F8FA] text-[#0A7CFF] border border-[#0A7CFF]"
          : "bg-[#2E9BF5] text-white"
      }`}
    >
      {isTapped ? "\u2713 Tap Sent" : "Connect"}
    </button>
  );
}