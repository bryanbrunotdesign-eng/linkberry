import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

// The circle path from the Linkberry logo SVG
const CIRCLE_PATH = "M25.097 13.0969C25.097 19.7244 19.7244 25.097 13.0969 25.097C6.46952 25.097 1.09693 19.7244 1.09693 13.0969C1.09693 6.46952 6.46952 1.09693 13.0969 1.09693C19.7244 1.09693 25.097 6.46952 25.097 13.0969Z";

export default function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Animation phases: "visible" → "shrink" → done
  const [phase, setPhase] = useState<"visible" | "shrink">("visible");

  useEffect(() => {
    if (loading) return;

    // Hold the splash for 2.2s then animate out
    const holdTimer = setTimeout(() => setPhase("shrink"), 2200);

    // After shrink animation (400ms), route to correct screen
    const routeTimer = setTimeout(() => {
      if (user) {
        // Already signed in — check if onboarding done
        try {
          const raw = localStorage.getItem("linkberry_user_profile_v1");
          const profile = raw ? JSON.parse(raw) : null;
          navigate(profile?.onboardingComplete ? "/" : "/onboarding", { replace: true });
        } catch {
          navigate("/onboarding", { replace: true });
        }
      } else {
        navigate("/auth", { replace: true });
      }
    }, 2600);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(routeTimer);
    };
  }, [loading, user, navigate]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#F0F4FF" }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            top: "-80px",
            left: "-80px",
            background: "radial-gradient(circle, #C7D7FF 0%, transparent 70%)",
            filter: "blur(60px)",
            opacity: 0.9,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 360,
            height: 360,
            bottom: "-60px",
            right: "-60px",
            background: "radial-gradient(circle, #B8F0E0 0%, transparent 70%)",
            filter: "blur(60px)",
            opacity: 0.8,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 280,
            height: 280,
            top: "40%",
            left: "30%",
            background: "radial-gradient(circle, #FFD9C2 0%, transparent 70%)",
            filter: "blur(50px)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Logo + dots */}
      <div
        style={{
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
          transform: phase === "shrink" ? "scale(0.5)" : "scale(1)",
          opacity: phase === "shrink" ? 0 : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Logo mark with spinning dots */}
        <div className="relative" style={{ width: 88, height: 88 }}>
          {/* Spinning dot ring */}
          <svg
            width="88"
            height="88"
            viewBox="0 0 88 88"
            fill="none"
            style={{ position: "absolute", inset: 0, animation: "spin 2.4s linear infinite" }}
          >
            <circle
              cx="44"
              cy="44"
              r="40"
              stroke="url(#splash-grad)"
              strokeWidth="3.5"
              strokeDasharray="1.2 7.8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="splash-grad" x1="4" y1="4" x2="84" y2="84" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0A7CFF" />
                <stop offset="0.6" stopColor="#00C6A7" />
                <stop offset="1" stopColor="#0A7CFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center icon */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl"
            style={{
              margin: 14,
              background: "white",
              boxShadow: "0 4px 24px rgba(10,124,255,0.18)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 26.19 26.19" fill="none">
              <path
                d={CIRCLE_PATH}
                stroke="url(#icon-grad)"
                strokeDasharray="0.11 4.39"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.19"
              />
              <defs>
                <linearGradient id="icon-grad" x1="5.71" y1="1.1" x2="21.4" y2="25.1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0A7CFF" />
                  <stop offset="1" stopColor="#00C6A7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Rethink Sans', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#0D1117",
              letterSpacing: "-0.5px",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Linkberry
          </h1>
          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 13,
              color: "#718096",
              marginTop: 6,
              letterSpacing: "0.2px",
            }}
          >
            AI-powered networking
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
