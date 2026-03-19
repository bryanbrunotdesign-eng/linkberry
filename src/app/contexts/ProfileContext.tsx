import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface UserProfileData {
  name: string;
  headline: string;
  company: string;
  role: string;
  location: string;
  email: string;
  website: string;
  bio: string;
  skills: string[];
  interests: string[];
  profileImage: string;
  experience: ExperienceItem[];
  // Onboarding fields
  goals: string[];
  industries: string[];
  intent: string[];
  eventPreferences: string[];
  onboardingComplete: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

const PROFILE_STORAGE_KEY = "linkberry_user_profile_v1";

const DEFAULT_PROFILE: UserProfileData = {
  name: "Alexandra Rivera",
  headline: "Product Design Lead - Building delightful AI experiences",
  company: "Lattice Design Co.",
  role: "Product Design Lead",
  location: "San Francisco, CA",
  email: "alex.rivera@lattice.co",
  website: "alexrivera.design",
  bio: "Passionate about the intersection of AI and human-centered design. 10+ years crafting digital products that empower teams. Speaker, mentor, and relentless networker.",
  skills: ["Product Design", "Design Systems", "AI/ML", "User Research", "Prototyping", "Workshop Facilitation"],
  interests: ["AI & Machine Learning", "Sustainability", "Leadership", "Startups"],
  profileImage: "",
  goals: [],
  industries: [],
  intent: [],
  eventPreferences: [],
  onboardingComplete: false,
  experience: [
    {
      id: "1",
      title: "Product Design Lead",
      company: "Lattice Design Co.",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: null,
      description: "Leading a cross-functional design team of 8, shipping AI-powered product experiences that serve 50K+ users.",
    },
    {
      id: "2",
      title: "Senior Product Designer",
      company: "Nextwave Labs",
      location: "San Francisco, CA",
      startDate: "Mar 2019",
      endDate: "Dec 2021",
      description: "Owned end-to-end design for the core SaaS platform.",
    },
  ],
};

function loadProfile(): UserProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      experience: Array.isArray(parsed.experience) ? parsed.experience : DEFAULT_PROFILE.experience,
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_PROFILE.skills,
      interests: Array.isArray(parsed.interests) ? parsed.interests : DEFAULT_PROFILE.interests,
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      industries: Array.isArray(parsed.industries) ? parsed.industries : [],
      intent: Array.isArray(parsed.intent) ? parsed.intent : [],
      eventPreferences: Array.isArray(parsed.eventPreferences) ? parsed.eventPreferences : [],
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

interface ProfileContextType {
  profile: UserProfileData;
  updateProfile: (updates: Partial<UserProfileData>) => void;
  saveProfile: (data: UserProfileData) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfileData>(loadProfile);

  const updateProfile = useCallback((updates: Partial<UserProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveProfile = useCallback((data: UserProfileData) => {
    setProfile(data);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
