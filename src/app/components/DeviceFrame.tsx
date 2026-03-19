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

  // Desktop preview — iPhone 16 Pro frame
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] p-6">
      <div className="relative">
        {/* Outer bezel — titanium-finish dark frame */}
        <div
          className="relative p-[13px] shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
          style={{
            width: 428,
            height: 900,
            borderRadius: 58,
            background: "linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 40%, #2c2c2e 100%)",
          }}
        >
          {/* Inner screen – transform creates a containing block for fixed children */}
          <div
            className="relative overflow-hidden bg-black"
            style={{ width: 402, height: 874, borderRadius: 46, transform: "translateZ(0)" }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none">
              <div
                className="bg-black"
                style={{
                  width: 120,
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
              <div className="w-[138px] h-[5px] bg-black/25 rounded-full" />
            </div>
          </div>
        </div>

        {/* Left side — Action button + Volume up + Volume down */}
        <div className="absolute left-[-3px] top-[108px] w-[3px] h-[14px] bg-[#3a3a3c] rounded-l-sm" style={{ borderRadius: "2px 0 0 2px" }} />
        <div className="absolute left-[-3px] top-[152px] w-[3px] h-[34px] bg-[#3a3a3c]" style={{ borderRadius: "2px 0 0 2px" }} />
        <div className="absolute left-[-3px] top-[198px] w-[3px] h-[34px] bg-[#3a3a3c]" style={{ borderRadius: "2px 0 0 2px" }} />

        {/* Right side — Power button + Camera Control (new on 16) */}
        <div className="absolute right-[-3px] top-[168px] w-[3px] h-[52px] bg-[#3a3a3c]" style={{ borderRadius: "0 2px 2px 0" }} />
        <div className="absolute right-[-3px] top-[460px] w-[3px] h-[44px] bg-[#3a3a3c]" style={{ borderRadius: "0 2px 2px 0" }} />
      </div>
    </div>
  );
}
