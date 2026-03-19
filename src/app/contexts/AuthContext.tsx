import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { useProfile } from "./ProfileContext";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { updateProfile } = useProfile();

  // Sync Google profile data into ProfileContext on sign-in
  const syncGoogleProfile = (u: User) => {
    const meta = u.user_metadata ?? {};
    const updates: Record<string, string> = {};

    if (meta.full_name && !updates.name) updates.name = meta.full_name;
    if (meta.name && !updates.name) updates.name = meta.name;
    if (meta.avatar_url) updates.profileImage = meta.avatar_url;
    if (meta.picture) updates.profileImage = meta.picture;
    if (u.email) updates.email = u.email;

    if (Object.keys(updates).length > 0) {
      updateProfile(updates);
    }
  };

  useEffect(() => {
    // Fallback: if Supabase never responds (e.g. missing env vars), unblock after 3s
    const timeout = setTimeout(() => setLoading(false), 3000);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) syncGoogleProfile(session.user);
      })
      .catch(() => {
        // Supabase unavailable — treat as unauthenticated
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) syncGoogleProfile(session.user);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  };

  const signInWithLinkedIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithLinkedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
