interface JobMatchCardProps {
  imageUrl: string;
  role: string;
  company: string;
  location: string;
  salary: string;
}

export function JobMatchCard({ imageUrl, role, company, location, salary }: JobMatchCardProps) {
  return (
    <div className="bg-[#F7F8FA] rounded-2xl p-3 flex gap-3 min-w-[270px]">
      <img
        src={imageUrl}
        alt={company}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-['Rethink_Sans',sans-serif] font-bold text-sm text-[#0D1117] mb-1 line-clamp-1">
          {role}
        </h4>
        <p className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117] mb-1 truncate">
          {company}
        </p>
        <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] mb-1 truncate">
          {location}
        </p>
        <p className="font-['Open_Sans',sans-serif] font-semibold text-xs text-[#0A7CFF] truncate">
          {salary}
        </p>
      </div>
      <button className="bg-[#0A7CFF] text-white rounded-xl px-4 py-2 h-fit font-['Open_Sans',sans-serif] font-semibold text-xs">
        Apply
      </button>
    </div>
  );
}