import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-xrhmkb8y";
import { useProfile } from "../contexts/ProfileContext";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80";

export function Header() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const avatarSrc = profile.profileImage || FALLBACK_AVATAR;

  return (
    <div className="bg-white px-4 pt-12 pb-1 mb-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative size-[24px]">
            <div className="absolute inset-[-4.57%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1939 26.1939">
                <path d={svgPaths.p26ba3a00} stroke="url(#paint0_linear_1_1535)" strokeDasharray="0.11 4.39" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.19386" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1535" x1="5.71231" x2="21.4047" y1="1.09693" y2="25.097">
                    <stop stopColor="#0A7CFF" />
                    <stop offset="1" stopColor="#00C6A7" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="font-['Rethink_Sans',sans-serif] font-semibold text-[18px] text-[#0D1117] tracking-[-0.36px]">
            Linkberry
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/my-profile")} className="rounded-full active:scale-95 transition-transform">
            <img
              src={avatarSrc}
              alt={profile.name}
              className="w-9 h-9 rounded-full border-2 border-[#E2E8F0] object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_AVATAR; }}
            />
          </button>
          <div className="relative p-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d={svgPaths.p866c00} stroke="#0D1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(3, 2.5)" />
            </svg>
            <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#FF5C3A] rounded-full" />
          </div>
          <div className="w-px h-5 bg-[#E2E8F0]" />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d={svgPaths.p110b7c50} stroke="#0D1117" strokeWidth="1.5" strokeLinecap="round" transform="translate(3, 6)" />
          </svg>
        </div>
      </div>
    </div>
  );
}