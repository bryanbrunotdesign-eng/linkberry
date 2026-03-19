import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useGoBack } from "../hooks/useGoBack";
import {
  ChevronLeft, Camera, Edit3, MapPin, Briefcase, Mail, Link2,
  Users, Calendar,
  MessageCircle, X, Check, Settings
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useProfile, UserProfileData } from "../contexts/ProfileContext";

// ------------------------------------------------------------------
// Section Card wrapper with optional edit button
// ------------------------------------------------------------------
function SectionCard({
  title,
  onEdit,
  children,
  className = "",
}: {
  title?: string;
  onEdit?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['Rethink_Sans',sans-serif] text-base font-semibold text-[#0D1117]">
            {title}
          </h2>
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg active:bg-[#F7F8FA] transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[#718096]" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ------------------------------------------------------------------
// Edit Sheet component
// ------------------------------------------------------------------
function EditSheet({
  isOpen,
  onClose,
  profile,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSave: (p: UserProfileData) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);
  const interestInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const addSkill = () => {
    const v = newSkill.trim();
    if (v && !draft.skills.includes(v)) {
      setDraft({ ...draft, skills: [...draft.skills, v] });
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setDraft({ ...draft, skills: draft.skills.filter((x) => x !== s) });

  const addInterest = () => {
    const v = newInterest.trim();
    if (v && !draft.interests.includes(v)) {
      setDraft({ ...draft, interests: [...draft.interests, v] });
      setNewInterest("");
    }
  };

  const removeInterest = (s: string) => setDraft({ ...draft, interests: draft.interests.filter((x) => x !== s) });

  const fieldClass = "w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-3 font-['Open_Sans',sans-serif] text-sm text-[#0D1117] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#0A7CFF] focus:ring-1 focus:ring-[#0A7CFF] transition-colors";

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-[24px] shadow-2xl max-h-[92dvh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-[#E2E8F0] flex-shrink-0">
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-[#0D1117]" />
          </button>
          <h3 className="font-['Rethink_Sans',sans-serif] font-semibold text-[#0D1117]">Edit Profile</h3>
          <button onClick={handleSave} className="font-['Rethink_Sans',sans-serif] font-semibold text-[#0A7CFF] text-sm">
            Save
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5 overscroll-contain">
          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Full Name</label>
            <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Headline</label>
            <input type="text" value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Role</label>
              <input type="text" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
            </div>
            <div>
              <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Company</label>
              <input type="text" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
            </div>
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Location</label>
            <input type="text" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Email</label>
            <input type="email" inputMode="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Website</label>
            <input type="url" inputMode="url" value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Bio</label>
            <textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} rows={4} className={`${fieldClass} resize-none`} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {draft.skills.map((s) => (
                <span key={s} className="flex items-center gap-1 bg-[#E0F2FF] text-[#0A7CFF] rounded-lg px-3 py-1.5 text-xs font-['Open_Sans',sans-serif] font-medium">
                  {s}
                  <button onClick={() => removeSkill(s)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input ref={skillInputRef} type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill..." enterKeyHint="done" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
              <button onClick={addSkill} className="bg-[#0A7CFF] text-white rounded-xl px-4 text-sm font-['Rethink_Sans',sans-serif] font-semibold flex-shrink-0">+</button>
            </div>
          </div>

          <div>
            <label className="block font-['Open_Sans',sans-serif] text-xs text-[#718096] uppercase tracking-wide mb-1.5">Interests</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {draft.interests.map((s) => (
                <span key={s} className="flex items-center gap-1 bg-[#FDF6E3] text-[#C9963A] rounded-lg px-3 py-1.5 text-xs font-['Open_Sans',sans-serif] font-medium">
                  {s}
                  <button onClick={() => removeInterest(s)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input ref={interestInputRef} type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Add interest..." enterKeyHint="done" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(); } }} className={fieldClass} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
              <button onClick={addInterest} className="bg-[#C9963A] text-white rounded-xl px-4 text-sm font-['Rethink_Sans',sans-serif] font-semibold flex-shrink-0">+</button>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------
// Main User Profile Page
// ------------------------------------------------------------------
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80";

// v2 - uses ProfileContext for shared state
export default function UserProfile() {
  const navigate = useNavigate();
  const goBack = useGoBack("/");
  const { profile, saveProfile } = useProfile();
  const [showEditSheet, setShowEditSheet] = useState(false);

  const currentStreak = 4;
  const longestStreak = 12;

  const handleSaveProfile = (updated: UserProfileData) => {
    saveProfile(updated);
  };

  const openEdit = () => setShowEditSheet(true);
  const avatarSrc = profile.profileImage || FALLBACK_AVATAR;

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-['Open_Sans',sans-serif] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0]">
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={() => goBack()} className="p-2 -ml-2 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
          </button>
          <h1 className="font-['Rethink_Sans',sans-serif] font-semibold text-[#0D1117]">My Profile</h1>
          <button onClick={openEdit} className="p-2 -mr-2 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-[#0D1117]" />
          </button>
        </div>
      </div>

      {/* Profile Hero Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={avatarSrc}
                alt={profile.name}
                className="w-28 h-28 rounded-2xl object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_AVATAR; }}
              />
              <label
                htmlFor="profile-photo-upload"
                className="absolute bottom-1 right-1 w-7 h-7 bg-[#0A7CFF] rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer"
              >
                <Camera className="w-3 h-3 text-white" />
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (typeof ev.target?.result === "string") {
                      saveProfile({ ...profile, profileImage: ev.target.result });
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-1">
                {profile.name}
              </h1>

              <p className="font-['Open_Sans',sans-serif] text-sm text-[#0D1117]">
                {profile.role}
              </p>
              <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-1">
                {profile.company}
              </p>

              <div className="flex items-center gap-1.5 text-[#718096] mb-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-['Open_Sans',sans-serif] text-xs">{profile.location}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#718096] mb-1">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-['Open_Sans',sans-serif] text-xs">{profile.email}</span>
              </div>

              {profile.website && (
                <div className="flex items-center gap-1.5 text-[#0A7CFF]">
                  <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-['Open_Sans',sans-serif] text-xs font-medium">{profile.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={openEdit}
              className="flex-1 py-3 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold bg-[#0A7CFF] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={openEdit}
              className="flex-1 py-3 rounded-xl font-['Open_Sans',sans-serif] text-sm font-semibold bg-[#F7F8FA] text-[#0D1117] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Activity Streak Card */}
      <div className="px-4 mt-3">
        <div className="bg-[#1E2A3A] rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Rethink_Sans',sans-serif] font-bold text-white">Activity Streak</h2>
            <span className="font-['Rethink_Sans',sans-serif] font-bold text-2xl text-white">
              {currentStreak}<span className="text-sm text-white/60 ml-1">days</span>
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const isActive = i < currentStreak;
              const isToday = i === currentStreak - 1;
              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="font-['Open_Sans',sans-serif] text-[10px] text-white/40">{day}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? "bg-[#FF5C3A]" : "bg-white/10"} ${isToday ? "ring-2 ring-[#FF5C3A]/50" : ""}`}>
                    {isActive ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 rounded bg-white/20" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="font-['Open_Sans',sans-serif] text-xs text-white/50">Longest streak</span>
            <span className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#F0C875]">{longestStreak} days</span>
          </div>
        </div>
      </div>

      {/* Networking Stats Card — matches dashboard StatsIndicators */}
      <div className="px-4 mt-3">
        <SectionCard title="My Networking Stats">
          <div className="flex items-center gap-3">
            {[
              { label: "Events", value: "42", color: "#0A7CFF", iconEl: <Calendar className="w-4 h-4" /> },
              { label: "Connections", value: "156", color: "#2E9BF5", iconEl: <Users className="w-4 h-4" /> },
              { label: "Messages", value: "23", color: "#FF5C3A", iconEl: <MessageCircle className="w-4 h-4" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 bg-[#F7F8FA] rounded-xl p-3.5 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {stat.iconEl}
                </div>
                <div className="text-center">
                  <p className="font-['Rethink_Sans',sans-serif] font-bold text-lg text-[#0D1117] leading-tight">{stat.value}</p>
                  <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* About Card */}
      <div className="px-4 mt-3">
        <SectionCard title="About" onEdit={openEdit}>
          <p className="font-['Open_Sans',sans-serif] text-sm text-[#4A5568] leading-relaxed">{profile.bio}</p>
        </SectionCard>
      </div>

      {/* Experience Card */}
      <div className="px-4 mt-3">
        <SectionCard title="Experience" onEdit={openEdit}>
          <div className="space-y-0">
            {profile.experience.map((exp, idx) => (
              <div key={exp.id}>
                {idx > 0 && <div className="border-t border-[#E2E8F0] my-4" />}
                <div className="flex gap-3.5">
                  {/* Timeline icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase className="w-4 h-4 text-[#718096]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117]">
                      {exp.title}
                    </h3>
                    <p className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117] mt-0.5">
                      {exp.company}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-['Open_Sans',sans-serif] text-[11px] text-[#718096]">
                        {exp.startDate} — {exp.endDate ?? "Present"}
                      </span>
                      <span className="text-[#E2E8F0] text-[11px]">·</span>
                      <span className="font-['Open_Sans',sans-serif] text-[11px] text-[#718096]">
                        {exp.location}
                      </span>
                    </div>
                    <p className="font-['Open_Sans',sans-serif] text-xs text-[#4A5568] mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Skills Card */}
      <div className="px-4 mt-3">
        <SectionCard title="Skills" onEdit={openEdit}>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="px-3.5 py-1.5 bg-[#F7F8FA] rounded-full font-['Open_Sans',sans-serif] text-xs font-medium text-[#0D1117]">{s}</span>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Interests Card */}
      <div className="px-4 mt-3 mb-6">
        <SectionCard title="Interests" onEdit={openEdit}>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((s) => (
              <span key={s} className="px-3.5 py-1.5 bg-[#F7F8FA] rounded-full font-['Open_Sans',sans-serif] text-xs font-medium text-[#0D1117]">{s}</span>
            ))}
          </div>
        </SectionCard>
      </div>

      <BottomNav />

      <EditSheet
        isOpen={showEditSheet}
        onClose={() => setShowEditSheet(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}