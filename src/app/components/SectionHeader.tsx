import { Link } from "react-router";

interface SectionHeaderProps {
  title: string;
  count?: number;
  linkTo?: string;
  onChevronClick?: () => void;
  isAtEnd?: boolean;
}

export function SectionHeader({ title, count, linkTo, onChevronClick, isAtEnd = false }: SectionHeaderProps) {
  const chevronIcon = (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      className="flex-shrink-0 transition-transform duration-300" 
      style={{ transform: isAtEnd ? 'rotate(180deg)' : 'none' }}
    >
      <path d="M7.5 15L12.5 10L7.5 5" stroke="#0D1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="px-4 mb-2 flex items-center justify-between gap-2">
      {linkTo ? (
        <Link to={linkTo} className="font-['Rethink_Sans',sans-serif] font-semibold text-lg flex-shrink min-w-0">
          <span className="line-clamp-1">{title}</span>
        </Link>
      ) : (
        <h3 className="font-['Rethink_Sans',sans-serif] font-semibold text-lg flex-shrink min-w-0">
          <span className="line-clamp-1">{title}</span>
        </h3>
      )}
      {onChevronClick ? (
        <button 
          onClick={onChevronClick}
          className="flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          {chevronIcon}
        </button>
      ) : linkTo ? (
        <Link 
          to={linkTo}
          className="flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          {chevronIcon}
        </Link>
      ) : null}
    </div>
  );
}