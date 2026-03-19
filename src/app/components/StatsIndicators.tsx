export function StatsIndicators() {
  const stats = [
    { label: "Events", value: "42", color: "#0A7CFF" },
    { label: "Connections", value: "156", color: "#2E9BF5" },
    { label: "Messages", value: "23", color: "#FF5C3A" },
  ];

  return (
    <div className="px-4 pt-3 pb-2.5">
      <p className="font-['Open_Sans',sans-serif] text-[10px] tracking-[0.08em] text-[#A0AEC0] uppercase mb-1">
        My Networking Stats
      </p>
      <div className="flex items-center gap-1">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className="text-[#E2E8F0] text-xs mx-0.5">·</span>
            )}
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ backgroundColor: stat.color }}
            />
            <span className="font-['Open_Sans',sans-serif] text-[11px] text-[#0D1117] whitespace-nowrap">
              {stat.value} {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}