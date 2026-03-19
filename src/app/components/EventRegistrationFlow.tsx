import { useState, useEffect, useRef } from "react";
import { Clock, ChevronDown, X, Share2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useScrollLock } from "../hooks/useScrollLock";
import svgPaths from "../../imports/svg-i231tog6mk";
import { imgGroup } from "../../imports/svg-a8wbw";

type Step = "form" | "registered" | "added";

interface EventRegistrationFlowProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  onClose: () => void;
  onRegister: (data: RegistrationData) => void;
  onAddToCalendar: () => void;
  onGoToCalendar?: () => void;
}

export interface RegistrationData {
  email: string;
  role: string;
  topics: string[];
  hereFor: string[];
  canOffer: string[];
}

const ROLES = [
  "Product Manager",
  "Software Engineer",
  "Designer",
  "Data Scientist",
  "Founder / CEO",
  "Investor",
  "Marketing",
  "Sales",
  "Operations",
  "Student",
  "Other",
];

const TOPICS = [
  "GenAI",
  "Future of Work",
  "Datascience",
  "HR Tech",
  "EdTech",
  "Health Tech",
  "VC Funds",
  "Angel Investment",
];

const HERE_FOR_OPTIONS = [
  "Find Mentors",
  "Network",
  "Learn New Tech",
  "Explore Partnerships",
  "Recruit Talent",
  "Get Feedback",
];

const CAN_OFFER_OPTIONS = [
  "Services",
  "Mentorship",
  "Investment",
  "Hiring",
  "Partnerships",
  "Technical Expertise",
];

// Mock Linkberry profile data
const LINKBERRY_PROFILE = {
  email: "bryan.brunot@linkberry.app",
  role: "Product Manager",
};

// Calendar planner icon from Figma
function CalendarPlannerIcon() {
  return (
    <div className="h-[80px] overflow-clip relative shrink-0 w-[80px]">
      <div
        className="absolute inset-[4.29%_0.01%_4.29%_0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0.004px_-0.124px] mask-size-[99.996px_91.665px]"
        style={{ maskImage: `url('${imgGroup}')` }}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.9984 91.4214">
          <path d={svgPaths.p2de4b680} fill="#2E9BF5" />
          <path d={svgPaths.p13de5c80} fill="black" />
        </svg>
      </div>
      <div className="absolute inset-[75.6%_24.47%_15.52%_6.96%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68.5651 8.87856">
          <path d={svgPaths.p31748500} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[9.56%_16.05%_21.41%_1.47%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 82.4828 69.0263">
          <path d={svgPaths.p32f63580} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[30.84%_16.62%_53.23%_61.37%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.0164 15.9274">
          <path d={svgPaths.p46ec770} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[14.21%_75.08%_75.22%_15.05%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8759 10.5695">
          <path d={svgPaths.p178d8140} fill="#94A3B8" />
        </svg>
      </div>
      <div className="absolute inset-[5.95%_76.78%_80.8%_17.75%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.47786 13.2485">
          <path d={svgPaths.p1a3d2080} fill="#2E9BF5" />
        </svg>
      </div>
      <div className="absolute inset-[30.85%_52.63%_49.64%_18.73%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.6416 19.5081">
          <path d={svgPaths.p856d300} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[30.85%_36.04%_51.27%_42.9%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.0566 17.8771">
          <path d={svgPaths.p7f96500} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[29.73%_78.15%_52.4%_1.47%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.3817 17.8771">
          <path d={svgPaths.p1e33e100} fill="#2E9BF5" />
        </svg>
      </div>
      <div className="absolute inset-[60.74%_57.1%_21.38%_21.85%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.0566 17.8771">
          <path d={svgPaths.p2b3eea00} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[46.77%_57.1%_37.3%_21.85%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.0566 15.9237">
          <path d={svgPaths.p1407d700} fill="#2E9BF5" />
        </svg>
      </div>
      <div className="absolute inset-[14.21%_52.89%_75.22%_37.24%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8759 10.5695">
          <path d={svgPaths.p3976d000} fill="#94A3B8" />
        </svg>
      </div>
      <div className="absolute inset-[5.95%_54.59%_80.8%_39.93%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.47786 13.2485">
          <path d={svgPaths.p226be480} fill="#2E9BF5" />
        </svg>
      </div>
      <div className="absolute inset-[14.21%_30.7%_75.22%_59.42%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.87589 10.5695">
          <path d={svgPaths.p10862040} fill="#94A3B8" />
        </svg>
      </div>
      <div className="absolute inset-[5.95%_32.4%_80.8%_62.12%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.47786 13.2485">
          <path d={svgPaths.p2fce0800} fill="#2E9BF5" />
        </svg>
      </div>
      <div className="absolute inset-[52.32%_1.47%_5.75%_56.6%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.9332 41.9332">
          <path d={svgPaths.p215200} fill="#2E9BF5" />
        </svg>
      </div>
      <div className="absolute inset-[59.89%_9.57%_13.89%_64.17%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.2519 26.215">
          <path d={svgPaths.pf2f7ac0} fill="#F2FBFF" />
        </svg>
      </div>
    </div>
  );
}

// Checkmark circle icon
function RegisteredCheckIcon() {
  return (
    <div className="relative w-[80px] h-[80px]">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="44" r="34" fill="#2E9BF5" />
        <path d="M26 44L36 54L56 32" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="44" r="34" stroke="#0D1117" strokeWidth="2.5" fill="none" />
      </svg>
    </div>
  );
}

// Countdown timer
function CountdownTimer({ eventDate, eventTime }: { eventDate: string; eventTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    setTimeLeft("21h 36m");
    const interval = setInterval(() => setTimeLeft("21h 36m"), 60000);
    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  return (
    <div className="bg-[#F7F8FA] h-[44px] rounded-[36px] w-full flex items-center gap-3 px-4">
      <Clock className="w-4 h-4 text-[#0D1117] flex-shrink-0" />
      <p className="font-['Open_Sans',sans-serif] text-[14px] text-[#0D1117] tracking-[-0.28px]">
        Event starting in {timeLeft}
      </p>
    </div>
  );
}

// Dropdown component
function Dropdown({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-[#F4F4F4] h-[44px] rounded-xl w-full flex items-center justify-between px-4 border border-transparent focus:border-[#2E9BF5] transition-colors"
      >
        <span
          className={`font-['Open_Sans',sans-serif] text-[14px] tracking-[-0.28px] ${
            value ? "text-[#0D1117]" : "text-[#0D1117]/40"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#0D1117] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-[48px] left-0 right-0 bg-white rounded-xl shadow-lg border border-[#F7F8FA] z-50 max-h-[180px] overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 font-['Open_Sans',sans-serif] text-[13px] transition-colors first:rounded-t-xl last:rounded-b-xl ${
                value === opt ? "text-[#0A7CFF] bg-[#0A7CFF]/5" : "text-[#0D1117]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Shared bottom sheet wrapper
function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-t-[24px] max-h-[90dvh] flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#0D1117]/15" />
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function EventRegistrationFlow({
  eventTitle,
  eventDate,
  eventTime,
  onClose,
  onRegister,
  onAddToCalendar,
  onGoToCalendar,
}: EventRegistrationFlowProps) {
  useScrollLock(true);
  const [step, setStep] = useState<Step>("form");

  // Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [hereFor, setHereFor] = useState<string[]>([]);
  const [canOffer, setCanOffer] = useState<string[]>([]);
  const [linkberryShare, setLinkberryShare] = useState(false);

  // Custom pill state
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [customHereFor, setCustomHereFor] = useState<string[]>([]);
  const [customCanOffer, setCustomCanOffer] = useState<string[]>([]);
  const [editingField, setEditingField] = useState<"topics" | "hereFor" | "canOffer" | null>(null);
  const [customInput, setCustomInput] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [editingField]);

  const handleCustomSubmit = (field: "topics" | "hereFor" | "canOffer") => {
    const value = customInput.trim();
    if (!value) {
      setEditingField(null);
      setCustomInput("");
      return;
    }
    if (field === "topics") {
      if (!TOPICS.includes(value) && !customTopics.includes(value)) {
        setCustomTopics((prev) => [...prev, value]);
      }
      if (!selectedTopics.includes(value)) {
        setSelectedTopics((prev) => [...prev, value]);
      }
    } else if (field === "hereFor") {
      if (!HERE_FOR_OPTIONS.includes(value) && !customHereFor.includes(value)) {
        setCustomHereFor((prev) => [...prev, value]);
      }
      if (!hereFor.includes(value)) {
        setHereFor((prev) => [...prev, value]);
      }
    } else {
      if (!CAN_OFFER_OPTIONS.includes(value) && !customCanOffer.includes(value)) {
        setCustomCanOffer((prev) => [...prev, value]);
      }
      if (!canOffer.includes(value)) {
        setCanOffer((prev) => [...prev, value]);
      }
    }
    setCustomInput("");
    setEditingField(null);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleHereFor = (option: string) => {
    setHereFor((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const toggleCanOffer = (option: string) => {
    setCanOffer((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleLinkberryToggle = () => {
    const next = !linkberryShare;
    setLinkberryShare(next);
    if (next) {
      setEmail(LINKBERRY_PROFILE.email);
      setRole(LINKBERRY_PROFILE.role);
    } else {
      setEmail("");
      setRole("");
    }
  };

  const isFormValid = email.trim().length > 0;

  const handleRegister = () => {
    if (!isFormValid) return;
    onRegister({ email, role, topics: selectedTopics, hereFor, canOffer });
    setStep("registered");
  };

  const handleAddToCalendar = () => {
    onAddToCalendar();
    setStep("added");
  };

  return (
    <AnimatePresence>
      <BottomSheet onClose={onClose}>
        {/* Step 1: Your Info Form */}
        {step === "form" && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-2 pb-3 flex-shrink-0">
              <div className="flex-1">
                <p className="font-['Open_Sans',sans-serif] text-[11px] text-[#2E9BF5] tracking-wider uppercase mb-1">
                  Sign Up
                </p>
                <h2 className="font-['Rethink_Sans',sans-serif] text-[#0D1117] text-[20px] leading-[26px]">
                  <strong>Your Info</strong>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-1 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#0D1117]/60" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#0D1117]/8 mx-5" />

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 pt-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
              <p className="font-['Open_Sans',sans-serif] text-[#0D1117]/60 text-[13px] leading-[18px] mb-5">
                Enter your information, select your preferences, and secure your spot!
              </p>

              {/* Form fields */}
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  enterKeyHint="next"
                  autoComplete="email"
                  onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
                  className="bg-[#F4F4F4] h-[44px] rounded-xl w-full px-4 font-['Open_Sans',sans-serif] text-[14px] text-[#0D1117] placeholder:text-[#0D1117]/40 tracking-[-0.28px] border border-transparent focus:border-[#2E9BF5] focus:outline-none transition-colors"
                />
                <Dropdown placeholder="Role" options={ROLES} value={role} onChange={setRole} />
              </div>

              {/* Linkberry share toggle */}
              <div className="flex items-center mt-3">
                <button
                  onClick={handleLinkberryToggle}
                  className={`h-[44px] rounded-xl w-full px-4 font-['Open_Sans',sans-serif] text-[13px] tracking-[-0.26px] flex items-center gap-2.5 transition-all border ${
                    linkberryShare
                      ? "bg-[#2E9BF5]/10 border-[#2E9BF5] text-[#2E9BF5]"
                      : "bg-[#F4F4F4] border-transparent text-[#0D1117]/70"
                  }`}
                >
                  <Share2 className="w-4 h-4 flex-shrink-0" />
                  <span>Have Linkberry share my info</span>
                  {linkberryShare && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[#2E9BF5] flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#0D1117]/8 my-5" />

              {/* Topics */}
              <div className="mb-5">
                <p className="font-['Open_Sans',sans-serif] text-[#0D1117] text-[13px] mb-3">
                  <strong>Which topics interest you?</strong>{" "}
                  <span className="text-[#0D1117]/50">(Select 2+)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-3.5 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border ${
                          isSelected
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "bg-white text-[#0D1117] border-[#0D1117]/20"
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                  {customTopics.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-3.5 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border ${
                          isSelected
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "bg-white text-[#0D1117] border-[#0D1117]/20"
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                  {editingField === "topics" ? (
                    <input
                      ref={customInputRef}
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit("topics")}
                      onBlur={() => handleCustomSubmit("topics")}
                      placeholder="Type & Enter"
                      className="px-3.5 py-1 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border border-[#2E9BF5] bg-white text-[#0D1117] outline-none w-[120px]"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEditingField("topics"); setCustomInput(""); }}
                      className="px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border border-dashed border-[#0D1117]/30 text-[#0D1117]/50 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Create Your Own
                    </button>
                  )}
                </div>
              </div>

              {/* I am here to... — pill selectors */}
              <div className="mb-5">
                <p className="font-['Open_Sans',sans-serif] text-[#0D1117] text-[13px] mb-3">
                  <strong>I am here to...</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {HERE_FOR_OPTIONS.map((option) => {
                    const isSelected = hereFor.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleHereFor(option)}
                        className={`px-3.5 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border ${
                          isSelected
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "bg-white text-[#0D1117] border-[#0D1117]/20"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                  {customHereFor.map((option) => {
                    const isSelected = hereFor.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleHereFor(option)}
                        className={`px-3.5 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border ${
                          isSelected
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "bg-white text-[#0D1117] border-[#0D1117]/20"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                  {editingField === "hereFor" ? (
                    <input
                      ref={customInputRef}
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit("hereFor")}
                      onBlur={() => handleCustomSubmit("hereFor")}
                      placeholder="Type & Enter"
                      className="px-3.5 py-1 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border border-[#2E9BF5] bg-white text-[#0D1117] outline-none w-[120px]"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEditingField("hereFor"); setCustomInput(""); }}
                      className="px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border border-dashed border-[#0D1117]/30 text-[#0D1117]/50 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Create Your Own
                    </button>
                  )}
                </div>
              </div>

              {/* I can offer... — pill selectors */}
              <div className="mb-2">
                <p className="font-['Open_Sans',sans-serif] text-[#0D1117] text-[13px] mb-3">
                  <strong>I can offer...</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {CAN_OFFER_OPTIONS.map((option) => {
                    const isSelected = canOffer.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleCanOffer(option)}
                        className={`px-3.5 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border ${
                          isSelected
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "bg-white text-[#0D1117] border-[#0D1117]/20"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                  {customCanOffer.map((option) => {
                    const isSelected = canOffer.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleCanOffer(option)}
                        className={`px-3.5 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border ${
                          isSelected
                            ? "bg-[#0D1117] text-white border-[#0D1117]"
                            : "bg-white text-[#0D1117] border-[#0D1117]/20"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                  {editingField === "canOffer" ? (
                    <input
                      ref={customInputRef}
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit("canOffer")}
                      onBlur={() => handleCustomSubmit("canOffer")}
                      placeholder="Type & Enter"
                      className="px-3.5 py-1 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border border-[#2E9BF5] bg-white text-[#0D1117] outline-none w-[120px]"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEditingField("canOffer"); setCustomInput(""); }}
                      className="px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-[12px] transition-all border border-dashed border-[#0D1117]/30 text-[#0D1117]/50 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Create Your Own
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="px-5 pt-3 pb-6 flex-shrink-0 space-y-2.5">
              <button
                onClick={handleRegister}
                disabled={!isFormValid}
                className={`w-full h-[46px] rounded-xl font-['Open_Sans',sans-serif] text-[15px] tracking-[-0.3px] transition-all ${
                  isFormValid
                    ? "bg-[#0A7CFF] text-white active:scale-[0.98]"
                    : "bg-[#0A7CFF]/30 text-white/70 cursor-not-allowed"
                }`}
              >
                <strong>Register</strong>
              </button>
              <button
                onClick={onClose}
                className="w-full h-[46px] rounded-xl font-['Open_Sans',sans-serif] text-[15px] text-[#0D1117] bg-[#F7F8FA] transition-colors tracking-[-0.3px]"
              >
                <strong>Close</strong>
              </button>
            </div>
          </>
        )}

        {/* Step 2: You're Registered! */}
        {step === "registered" && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-2 pb-3 flex-shrink-0">
              <div className="flex-1">
                <p className="font-['Open_Sans',sans-serif] text-[11px] text-[#2E9BF5] tracking-wider uppercase mb-1">
                  Confirmation
                </p>
                <h2 className="font-['Rethink_Sans',sans-serif] text-[#0D1117] text-[20px] leading-[26px]">
                  <strong>{eventTitle}</strong>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-1 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#0D1117]/60" />
              </button>
            </div>

            <div className="h-px bg-[#0D1117]/8 mx-5" />

            {/* Content */}
            <div className="flex-1 px-5 pt-8 pb-2 flex flex-col items-center">
              <RegisteredCheckIcon />
              <div className="font-['Rethink_Sans',sans-serif] text-[28px] leading-[32px] tracking-[-0.56px] text-center text-[#0D1117] mt-4">
                <p>You're Registered!</p>
              </div>
              <p className="font-['Open_Sans',sans-serif] text-[14px] leading-[20px] tracking-[-0.28px] text-center text-[#0D1117]/70 mt-2">
                A confirmation email has been sent to<br />
                {email || "AttendeeEmail@gmail.com"}.
              </p>
              <div className="w-full mt-6">
                <CountdownTimer eventDate={eventDate} eventTime={eventTime} />
              </div>
            </div>

            {/* Bottom actions */}
            <div className="px-5 pt-3 pb-6 flex-shrink-0 space-y-2.5">
              <button
                onClick={handleAddToCalendar}
                className="w-full h-[46px] rounded-xl font-['Open_Sans',sans-serif] text-[15px] text-white bg-[#0A7CFF] active:scale-[0.98] transition-all tracking-[-0.3px]"
              >
                <strong>Add to Calendar</strong>
              </button>
              <button
                onClick={onClose}
                className="w-full h-[46px] rounded-xl font-['Open_Sans',sans-serif] text-[15px] text-[#0D1117] bg-[#F7F8FA] transition-colors tracking-[-0.3px]"
              >
                <strong>Close</strong>
              </button>
            </div>
          </>
        )}

        {/* Step 3: Added to Calendar */}
        {step === "added" && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-2 pb-3 flex-shrink-0">
              <div className="flex-1">
                <p className="font-['Open_Sans',sans-serif] text-[11px] text-[#2E9BF5] tracking-wider uppercase mb-1">
                  Calendar
                </p>
                <h2 className="font-['Rethink_Sans',sans-serif] text-[#0D1117] text-[20px] leading-[26px]">
                  <strong>{eventTitle}</strong>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-1 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#0D1117]/60" />
              </button>
            </div>

            <div className="h-px bg-[#0D1117]/8 mx-5" />

            {/* Content */}
            <div className="flex-1 px-5 pt-8 pb-2 flex flex-col items-center">
              <CalendarPlannerIcon />
              <div className="font-['Rethink_Sans',sans-serif] text-[28px] leading-[32px] tracking-[-0.56px] text-center text-[#0D1117] mt-4">
                <p>Added to Calendar</p>
              </div>
              <p className="font-['Open_Sans',sans-serif] text-[14px] leading-[20px] tracking-[-0.28px] text-center text-[#0D1117]/70 mt-2">
                A confirmation email has been sent to<br />
                {email || "AttendeeEmail@gmail.com"}.
              </p>
              <div className="w-full mt-6">
                <CountdownTimer eventDate={eventDate} eventTime={eventTime} />
              </div>
            </div>

            {/* Bottom actions */}
            <div className="px-5 pt-3 pb-6 flex-shrink-0 space-y-2.5">
              <button
                onClick={() => onGoToCalendar?.()}
                className="w-full h-[46px] rounded-xl font-['Open_Sans',sans-serif] text-[15px] text-white bg-[#0A7CFF] active:scale-[0.98] transition-all tracking-[-0.3px]"
              >
                <strong>Go to Calendar</strong>
              </button>
              <button
                onClick={onClose}
                className="w-full h-[46px] rounded-xl font-['Open_Sans',sans-serif] text-[15px] text-[#0D1117] bg-[#F7F8FA] transition-colors tracking-[-0.3px]"
              >
                <strong>Close</strong>
              </button>
            </div>
          </>
        )}
      </BottomSheet>
    </AnimatePresence>
  );
}