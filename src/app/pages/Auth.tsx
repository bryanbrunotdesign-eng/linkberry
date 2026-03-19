import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

// ─── Morphic Background (same as Onboarding) ─────────────────────────────────
function MorphicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#F0F4FF]" />
      <div className="absolute rounded-full" style={{ width: 520, height: 520, top: "-140px", left: "-100px", background: "radial-gradient(circle at 40% 40%, #C7D7FF 0%, #E0EBFF 55%, transparent 75%)", filter: "blur(64px)", animation: "blob1 14s ease-in-out infinite", opacity: 0.85 }} />
      <div className="absolute rounded-full" style={{ width: 440, height: 440, bottom: "10%", right: "-80px", background: "radial-gradient(circle at 60% 60%, #B8F0E0 0%, #D6FAF0 55%, transparent 75%)", filter: "blur(72px)", animation: "blob2 18s ease-in-out infinite", opacity: 0.75 }} />
      <div className="absolute rounded-full" style={{ width: 360, height: 360, top: "35%", left: "20%", background: "radial-gradient(circle at 50% 50%, #FFD9C2 0%, #FFE8D8 55%, transparent 75%)", filter: "blur(60px)", animation: "blob3 22s ease-in-out infinite", opacity: 0.65 }} />
      <div className="absolute rounded-full" style={{ width: 300, height: 300, top: "60%", left: "-60px", background: "radial-gradient(circle at 50% 50%, #BAE6FF 0%, #D8F0FF 60%, transparent 80%)", filter: "blur(56px)", animation: "blob4 16s ease-in-out infinite", opacity: 0.7 }} />
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,60px) scale(1.08)} 66%{transform:translate(-30px,30px) scale(0.94)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,-40px) scale(1.1)} 66%{transform:translate(30px,50px) scale(0.92)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 33%{transform:translate(30px,-50px) scale(1.06) rotate(8deg)} 66%{transform:translate(-40px,20px) scale(0.96) rotate(-5deg)} }
        @keyframes blob4 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,-40px) scale(1.12)} }
      `}</style>
    </div>
  );
}

// ─── Google Icon ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <path d="M47.5 24.5c0-1.6-.15-3.2-.42-4.7H24v9h13.2a11.3 11.3 0 01-4.9 7.4v6.1h7.9c4.6-4.2 7.3-10.5 7.3-17.8z" fill="#4285F4" />
      <path d="M24 48c6.6 0 12.2-2.2 16.3-5.9l-7.9-6.1c-2.2 1.5-5 2.3-8.4 2.3-6.5 0-12-4.4-13.9-10.3H1.9v6.3C6 42.6 14.4 48 24 48z" fill="#34A853" />
      <path d="M10.1 28c-.5-1.5-.8-3.1-.8-4.7 0-1.6.3-3.2.8-4.7v-6.3H1.9A23.9 23.9 0 000 23.3c0 3.9.9 7.5 2.5 10.7L10.1 28z" fill="#FBBC05" />
      <path d="M24 9.5c3.6 0 6.8 1.2 9.3 3.7l7-7C36.2 2.2 30.6 0 24 0 14.4 0 6 5.4 1.9 13.3l8.2 6.3C12 13.9 17.5 9.5 24 9.5z" fill="#EA4335" />
    </svg>
  );
}

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077B5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Email Sign In / Sign Up ──────────────────────────────────────────────────
function EmailFlow({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const fieldClass = "w-full px-4 py-3.5 rounded-2xl font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]/40 transition-all";
  const fieldStyle = { background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(10,124,255,0.2)", backdropFilter: "blur(8px)" };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/onboarding", { replace: true });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center px-2">
        <div className="w-16 h-16 rounded-2xl bg-[#E0F2FF] flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-[#0A7CFF]" />
        </div>
        <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-2">Check your email</h2>
        <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096]">
          We sent a confirmation link to <strong>{email}</strong>. Click it to finish signing up.
        </p>
        <button onClick={onBack} className="mt-6 text-sm text-[#0A7CFF] font-['Open_Sans',sans-serif] font-medium">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="text-sm text-[#718096] font-['Open_Sans',sans-serif] mb-5 flex items-center gap-1">
        ← Back
      </button>
      <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-1">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h2>
      <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mb-6">
        {mode === "signin" ? "Sign in to your Linkberry account." : "Sign up with your email to get started."}
      </p>

      <div className="space-y-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className={fieldClass}
          style={fieldStyle}
        />
        <input
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={fieldClass}
          style={fieldStyle}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        />
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-500 font-['Open_Sans',sans-serif]">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !email || !password}
        className="mt-5 w-full py-4 rounded-2xl font-['Rethink_Sans',sans-serif] font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        style={{
          background: email && password ? "#0A7CFF" : "rgba(10,124,255,0.25)",
          color: "#fff",
          boxShadow: email && password ? "0 8px 24px rgba(10,124,255,0.3)" : "none",
        }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "signin" ? "Sign in" : "Create account")}
      </button>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 w-full text-center text-sm font-['Open_Sans',sans-serif] text-[#718096]"
      >
        {mode === "signin"
          ? <>Don't have an account? <span className="text-[#0A7CFF] font-medium">Sign up</span></>
          : <>Already have an account? <span className="text-[#0A7CFF] font-medium">Sign in</span></>
        }
      </button>
    </div>
  );
}

// ─── Main Auth Screen ─────────────────────────────────────────────────────────
export default function Auth() {
  const { signInWithGoogle, signInWithLinkedIn } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "linkedin" | null>(null);

  const handleGoogle = async () => {
    setLoadingProvider("google");
    await signInWithGoogle();
    setLoadingProvider(null);
  };

  const handleLinkedIn = async () => {
    setLoadingProvider("linkedin");
    await signInWithLinkedIn();
    setLoadingProvider(null);
  };

  const btnStyle = {
    background: "rgba(255,255,255,0.75)",
    border: "1.5px solid rgba(10,124,255,0.18)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-['Open_Sans',sans-serif]">
      <MorphicBackground />

      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-20 pb-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4" style={{ width: 64, height: 64 }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              style={{ position: "absolute", inset: 0, animation: "spin 3s linear infinite" }}
            >
              <circle cx="32" cy="32" r="28" stroke="url(#auth-grad)" strokeWidth="2.5" strokeDasharray="1.2 6.8" strokeLinecap="round" />
              <defs>
                <linearGradient id="auth-grad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0A7CFF" />
                  <stop offset="0.6" stopColor="#00C6A7" />
                  <stop offset="1" stopColor="#0A7CFF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div
              className="absolute flex items-center justify-center rounded-xl"
              style={{ inset: 10, background: "white", boxShadow: "0 2px 16px rgba(10,124,255,0.15)" }}
            >
              <svg width="24" height="24" viewBox="0 0 26.19 26.19" fill="none">
                <path d="M25.097 13.0969C25.097 19.7244 19.7244 25.097 13.0969 25.097C6.46952 25.097 1.09693 19.7244 1.09693 13.0969C1.09693 6.46952 6.46952 1.09693 13.0969 1.09693C19.7244 1.09693 25.097 6.46952 25.097 13.0969Z" stroke="url(#icon-g2)" strokeDasharray="0.11 4.39" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.19" />
                <defs>
                  <linearGradient id="icon-g2" x1="5.71" y1="1.1" x2="21.4" y2="25.1" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0A7CFF" />
                    <stop offset="1" stopColor="#00C6A7" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="font-['Rethink_Sans',sans-serif] text-2xl font-bold text-[#0D1117] tracking-tight">Linkberry</h1>
          <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mt-1">AI-powered networking</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-6 flex-1 max-h-[520px]"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 8px 40px rgba(10,124,255,0.08)",
          }}
        >
          {showEmail ? (
            <EmailFlow onBack={() => setShowEmail(false)} />
          ) : (
            <>
              <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-1">Get started</h2>
              <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mb-6">
                Sign in or create your account to continue.
              </p>

              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={!!loadingProvider}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117] transition-all active:scale-[0.98]"
                  style={btnStyle}
                >
                  {loadingProvider === "google" ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#0A7CFF]" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="flex-1 text-left">Continue with Google</span>
                  <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleLinkedIn}
                  disabled={!!loadingProvider}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117] transition-all active:scale-[0.98]"
                  style={btnStyle}
                >
                  {loadingProvider === "linkedin" ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#0077B5]" />
                  ) : (
                    <LinkedInIcon />
                  )}
                  <span className="flex-1 text-left">Continue with LinkedIn</span>
                  <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                  <span className="font-['Open_Sans',sans-serif] text-xs text-[#A0AEC0]">or</span>
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                </div>

                {/* Email */}
                <button
                  onClick={() => setShowEmail(true)}
                  disabled={!!loadingProvider}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-['Open_Sans',sans-serif] text-sm font-semibold text-[#0D1117] transition-all active:scale-[0.98]"
                  style={btnStyle}
                >
                  <Mail className="w-5 h-5 text-[#718096]" />
                  <span className="flex-1 text-left">Sign up with Email</span>
                  <ArrowRight className="w-4 h-4 text-[#A0AEC0]" />
                </button>
              </div>

              <p className="mt-6 text-center font-['Open_Sans',sans-serif] text-[11px] text-[#A0AEC0] leading-relaxed">
                By continuing, you agree to Linkberry's{" "}
                <span className="text-[#0A7CFF]">Terms of Service</span> and{" "}
                <span className="text-[#0A7CFF]">Privacy Policy</span>.
              </p>
            </>
          )}
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
