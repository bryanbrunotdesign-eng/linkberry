import React, { useEffect, useState } from "react";

/**
 * iPhone 15 Pro-style device frame that wraps the app content.
 * On small viewports (actual phones), it disappears and the app goes full-bleed.
 * On larger screens (desktop preview), it renders a centered phone bezel.
 *
 * Uses a media-query listener so the children are only mounted once.
 */
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) {
    // Full-bleed on real mobile / narrow viewport
    return <div className="min-h-screen">{children}</div>;
  }

  // Desktop preview — iPhone 15 Pro frame
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e] p-6">
      <div className="relative">
        {/* Outer bezel */}
        <div
          className="relative rounded-[54px] bg-[#1C1C1E] p-[12px] shadow-2xl"
          style={{ width: 417, height: 876 }}
        >
          {/* Inner screen – transform creates a containing block for fixed children */}
          <div
            className="relative rounded-[44px] overflow-hidden bg-black"
            style={{ width: 393, height: 852, transform: "translateZ(0)" }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none">
              <div
                className="bg-black"
                style={{
                  width: 126,
                  height: 36,
                  borderBottomLeftRadius: 22,
                  borderBottomRightRadius: 22,
                }}
              />
            </div>

            {/* Scrollable app content */}
            <div
              data-device-scroll
              className="w-full h-full overflow-y-auto overflow-x-hidden bg-white"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {children}
            </div>

            {/* Home indicator bar */}
            <div className="absolute bottom-2 left-0 right-0 z-[200] flex justify-center pointer-events-none">
              <div className="w-[134px] h-[5px] bg-black/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute left-[-2px] top-[126px] w-[3px] h-[18px] bg-[#2C2C2E] rounded-l-sm" />
        <div className="absolute left-[-2px] top-[168px] w-[3px] h-[32px] bg-[#2C2C2E] rounded-l-sm" />
        <div className="absolute left-[-2px] top-[210px] w-[3px] h-[32px] bg-[#2C2C2E] rounded-l-sm" />
        <div className="absolute right-[-2px] top-[186px] w-[3px] h-[48px] bg-[#2C2C2E] rounded-r-sm" />
      </div>
    </div>
  );
}
