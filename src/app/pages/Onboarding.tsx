import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ChevronLeft, Camera, User, ImageIcon } from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "photo" | "name" | "goals" | "industries" | "intent" | "events";

const STEPS: Step[] = ["photo", "name", "goals", "industries", "intent", "events"];

// ─── Morphic Blob Background ──────────────────────────────────────────────────
function MorphicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#F0F4FF]" />

      {/* Blob 1 – soft lavender */}
      <div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          top: "-140px",
          left: "-100px",
          background: "radial-gradient(circle at 40% 40%, #C7D7FF 0%, #E0EBFF 55%, transparent 75%)",
          filter: "blur(64px)",
          animation: "blob1 14s ease-in-out infinite",
          opacity: 0.85,
        }}
      />

      {/* Blob 2 – soft mint */}
      <div
        className="absolute rounded-full"
        style={{
          width: 440,
          height: 440,
          bottom: "10%",
          right: "-80px",
          background: "radial-gradient(circle at 60% 60%, #B8F0E0 0%, #D6FAF0 55%, transparent 75%)",
          filter: "blur(72px)",
          animation: "blob2 18s ease-in-out infinite",
          opacity: 0.75,
        }}
      />

      {/* Blob 3 – soft peach */}
      <div
        className="absolute rounded-full"
        style={{
          width: 360,
          height: 360,
          top: "35%",
          left: "20%",
          background: "radial-gradient(circle at 50% 50%, #FFD9C2 0%, #FFE8D8 55%, transparent 75%)",
          filter: "blur(60px)",
          animation: "blob3 22s ease-in-out infinite",
          opacity: 0.65,
        }}
      />

      {/* Blob 4 – soft sky */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: "60%",
          left: "-60px",
          background: "radial-gradient(circle at 50% 50%, #BAE6FF 0%, #D8F0FF 60%, transparent 80%)",
          filter: "blur(56px)",
          animation: "blob4 16s ease-in-out infinite",
          opacity: 0.7,
        }}
      />

      <style>{`
        @keyframes blob1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,60px) scale(1.08); }
          66%      { transform: translate(-30px,30px) scale(0.94); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-50px,-40px) scale(1.1); }
          66%      { transform: translate(30px,50px) scale(0.92); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          33%      { transform: translate(30px,-50px) scale(1.06) rotate(8deg); }
          66%      { transform: translate(-40px,20px) scale(0.96) rotate(-5deg); }
        }
        @keyframes blob4 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(60px,-40px) scale(1.12); }
        }
      `}</style>
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 px-6 pt-16 pb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1 rounded-full transition-all duration-500"
          style={{
            background: i <= current ? "#0A7CFF" : "rgba(10,124,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-4 py-2.5 rounded-2xl text-sm font-['Open_Sans',sans-serif] font-medium transition-all duration-200 active:scale-95 select-none"
      style={{
        background: selected ? "#0A7CFF" : "rgba(255,255,255,0.7)",
        color: selected ? "#fff" : "#0D1117",
        border: selected ? "1.5px solid #0A7CFF" : "1.5px solid rgba(10,124,255,0.2)",
        backdropFilter: "blur(8px)",
        boxShadow: selected ? "0 4px 12px rgba(10,124,255,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {label}
    </button>
  );
}

// ─── Photo Step ───────────────────────────────────────────────────────────────
function PhotoStep({
  image,
  name,
  onImage,
}: {
  image: string;
  name: string;
  onImage: (url: string) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") onImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const firstName = name ? name.split(" ")[0] : "";

  return (
    <div className="flex flex-col items-center text-center px-6 pt-6">
      <h1 className="font-['Rethink_Sans',sans-serif] text-[28px] font-bold text-[#0D1117] leading-tight mb-2">
        {firstName ? `Hi, ${firstName}!` : "Add your photo"}
      </h1>
      <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mb-8 max-w-xs">
        A photo helps people recognise you at events. You can always change it later.
      </p>

      {/* Avatar preview */}
      <div className="relative mb-7">
        <div
          className="w-32 h-32 rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            background: image ? "transparent" : "rgba(255,255,255,0.65)",
            border: image ? "none" : "2px dashed rgba(10,124,255,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-14 h-14 text-[#0A7CFF] opacity-40" />
          )}
        </div>
        {image && (
          <div
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
            style={{ background: "#0A7CFF" }}
            onClick={() => galleryRef.current?.click()}
          >
            <Camera className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Hidden inputs */}
      {/* Camera capture (front camera on mobile) */}
      <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile} />
      {/* Gallery picker */}
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {image ? (
        <p className="text-xs font-['Open_Sans',sans-serif] text-[#0A7CFF] font-medium mb-4">
          Looks great! ✓
        </p>
      ) : (
        <div className="flex gap-3 w-full max-w-xs">
          {/* Take photo */}
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.75)",
              color: "#0A7CFF",
              border: "1.5px solid rgba(10,124,255,0.25)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(10,124,255,0.1)",
            }}
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </button>

          {/* Choose from library */}
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl font-['Open_Sans',sans-serif] text-sm font-semibold transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.75)",
              color: "#0D1117",
              border: "1.5px solid rgba(10,124,255,0.15)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <ImageIcon className="w-5 h-5 text-[#718096]" />
            Library
          </button>
        </div>
      )}

      {image && (
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="text-sm text-[#718096] font-['Open_Sans',sans-serif] underline underline-offset-2"
        >
          Change photo
        </button>
      )}
    </div>
  );
}

// ─── Name Step ────────────────────────────────────────────────────────────────
function NameStep({
  name,
  headline,
  onChange,
}: {
  name: string;
  headline: string;
  onChange: (field: "name" | "headline", value: string) => void;
}) {
  return (
    <div className="px-6 pt-6">
      <h1 className="font-['Rethink_Sans',sans-serif] text-[26px] font-bold text-[#0D1117] leading-tight mb-2">
        What's your name?
      </h1>
      <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mb-8">
        This is how you'll appear to others on Linkberry.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full px-4 py-3.5 rounded-2xl font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]/40 transition-all"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1.5px solid rgba(10,124,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
            autoFocus
          />
        </div>

        <div>
          <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-2">
            Headline <span className="normal-case text-[#A0AEC0]">(optional)</span>
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => onChange("headline", e.target.value)}
            placeholder="e.g. Founder at Acme · AI enthusiast"
            className="w-full px-4 py-3.5 rounded-2xl font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]/40 transition-all"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1.5px solid rgba(10,124,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Chip Grid Step ───────────────────────────────────────────────────────────
function ChipStep({
  title,
  subtitle,
  metaNote,
  chips,
  selected,
  max,
  onToggle,
}: {
  title: string;
  subtitle: string;
  metaNote: string;
  chips: string[];
  selected: string[];
  max: number;
  onToggle: (chip: string) => void;
}) {
  return (
    <div className="px-6 pt-6">
      <h1 className="font-['Rethink_Sans',sans-serif] text-[26px] font-bold text-[#0D1117] leading-tight mb-2">
        {title}
      </h1>
      <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096] mb-1.5">{subtitle}</p>
      <p
        className="font-['Open_Sans',sans-serif] text-xs mb-7 px-3 py-2 rounded-xl"
        style={{ background: "rgba(10,124,255,0.08)", color: "#0A7CFF" }}
      >
        {metaNote}
      </p>

      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip) => {
          const isSelected = selected.includes(chip);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => !isDisabled && onToggle(chip)}
              className="px-4 py-2.5 rounded-2xl text-sm font-['Open_Sans',sans-serif] font-medium transition-all duration-200 active:scale-95 select-none"
              style={{
                background: isSelected
                  ? "#0A7CFF"
                  : isDisabled
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(255,255,255,0.7)",
                color: isSelected ? "#fff" : isDisabled ? "#A0AEC0" : "#0D1117",
                border: isSelected
                  ? "1.5px solid #0A7CFF"
                  : "1.5px solid rgba(10,124,255,0.2)",
                backdropFilter: "blur(8px)",
                boxShadow: isSelected ? "0 4px 12px rgba(10,124,255,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="mt-5 font-['Open_Sans',sans-serif] text-xs text-[#718096]">
          {selected.length}/{max} selected
        </p>
      )}
    </div>
  );
}

// ─── Main Onboarding ──────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useProfile();
  const { user } = useAuth();

  // Pre-fill from Google/LinkedIn OAuth or existing profile data
  const googleMeta = user?.user_metadata ?? {};
  const [stepIndex, setStepIndex] = useState(0);
  const [profileImage, setProfileImage] = useState(
    profile.profileImage || googleMeta.avatar_url || googleMeta.picture || ""
  );
  const [name, setName] = useState(
    profile.name !== "Alexandra Rivera" ? profile.name : (googleMeta.full_name || googleMeta.name || "")
  );
  const [headline, setHeadline] = useState(profile.headline || "");
  const [goals, setGoals] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [intent, setIntent] = useState<string[]>([]);
  const [eventPrefs, setEventPrefs] = useState<string[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);

  const currentStep = STEPS[stepIndex];

  const toggleItem = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
      setter((prev) =>
        prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
      );
    },
    []
  );

  const canAdvance = () => {
    switch (currentStep) {
      case "photo": return true; // photo is optional
      case "name": return name.trim().length >= 2;
      case "goals": return goals.length >= 1;
      case "industries": return industries.length >= 1;
      case "intent": return intent.length >= 1;
      case "events": return eventPrefs.length >= 1;
    }
  };

  const handleNext = () => {
    if (animating) return;
    if (stepIndex < STEPS.length - 1) {
      setDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setStepIndex((i) => i + 1);
        setAnimating(false);
      }, 180);
    } else {
      finish();
    }
  };

  const handleBack = () => {
    if (animating || stepIndex === 0) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setStepIndex((i) => i - 1);
      setAnimating(false);
    }, 180);
  };

  const finish = () => {
    updateProfile({
      profileImage,
      name: name.trim() || undefined,
      headline: headline.trim() || undefined,
      goals,
      industries,
      intent,
      eventPreferences: eventPrefs,
      onboardingComplete: true,
    });
    navigate("/", { replace: true });
  };

  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="relative min-h-screen overflow-hidden font-['Open_Sans',sans-serif]">
      <MorphicBackground />

      {/* Glass card container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <StepBar current={stepIndex} total={STEPS.length} />

        {/* Back button */}
        <div className="px-4 py-2 h-10">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-['Open_Sans',sans-serif] text-[#718096] active:opacity-60 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        {/* Step content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "forward"
                ? "translateX(24px)"
                : "translateX(-24px)"
              : "translateX(0)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
          }}
        >
          {currentStep === "photo" && (
            <PhotoStep image={profileImage} name={name} onImage={setProfileImage} />
          )}
          {currentStep === "name" && (
            <NameStep
              name={name}
              headline={headline}
              onChange={(field, val) => {
                if (field === "name") setName(val);
                else setHeadline(val);
              }}
            />
          )}
          {currentStep === "goals" && (
            <ChipStep
              title="What drives your networking?"
              subtitle="Select up to 3 goals. AI prioritises matches based on your mix."
              metaNote="High-performing founders value 1:1 coaching"
              chips={["Mentorship", "Investing", "Founder support", "Product feedback", "Talent scouting", "Co-founder search", "Customer introductions"]}
              selected={goals}
              max={3}
              onToggle={(c) => toggleItem(setGoals, c)}
            />
          )}
          {currentStep === "industries" && (
            <ChipStep
              title="Industry + expertise"
              subtitle="Tag sectors that describe the impact you want to make."
              metaNote="AI surfaces shared vertical signals across matches"
              chips={["Climate", "Healthtech", "Fintech", "AI & ML", "Mobility", "EdTech", "Consumer", "B2B SaaS", "Deep tech", "AI ethics"]}
              selected={industries}
              max={4}
              onToggle={(c) => toggleItem(setIndustries, c)}
            />
          )}
          {currentStep === "intent" && (
            <ChipStep
              title="Networking intent"
              subtitle="Choose how you want to show up. Intent guides the tone of AI suggestions."
              metaNote="Intent informs message prompts and match scoring"
              chips={["Coaching", "Investment", "Exploration", "Community building", "Hiring", "Partnerships"]}
              selected={intent}
              max={2}
              onToggle={(c) => toggleItem(setIntent, c)}
            />
          )}
          {currentStep === "events" && (
            <ChipStep
              title="Event preferences"
              subtitle="Pick formats that match your rhythm. Format + intensity drive AI RSVP recommendations."
              metaNote="AI ranks event intensity to match your energy"
              chips={["Roundtable", "Deep-dive lab", "Casual coffee", "AI salon", "Pitch session", "Virtual meetup", "Retreat"]}
              selected={eventPrefs}
              max={3}
              onToggle={(c) => toggleItem(setEventPrefs, c)}
            />
          )}
        </div>

        {/* CTA */}
        <div className="px-6 pb-10 pt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance()}
            className="w-full py-4 rounded-2xl font-['Rethink_Sans',sans-serif] font-semibold text-base transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: canAdvance() ? "#0A7CFF" : "rgba(10,124,255,0.25)",
              color: "#fff",
              boxShadow: canAdvance() ? "0 8px 24px rgba(10,124,255,0.3)" : "none",
              cursor: canAdvance() ? "pointer" : "not-allowed",
            }}
          >
            {isLast ? "Let's go" : currentStep === "photo" ? (profileImage ? "Looks great, continue" : "Skip for now") : "Continue"}
            {!isLast && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
