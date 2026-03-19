import { useEffect } from "react";
import { useLocation, Outlet, Navigate } from "react-router";
import { CalendarEventsProvider } from "../contexts/CalendarEventsContext";
import { ConnectionsProvider } from "../contexts/ConnectionsContext";
import { ChatsProvider } from "../contexts/ChatsContext";
import { ProfileProvider } from "../contexts/ProfileContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { DeviceFrame } from "./DeviceFrame";

// Paths that never redirect
const PUBLIC_PATHS = ["/splash", "/auth", "/onboarding"];

function isOnboardingComplete(): boolean {
  try {
    const raw = localStorage.getItem("linkberry_user_profile_v1");
    if (!raw) return false;
    return !!JSON.parse(raw)?.onboardingComplete;
  } catch {
    return false;
  }
}

export function RootLayout() {
  return (
    <ProfileProvider>
      <AuthProvider>
        <ConnectionsProvider>
          <CalendarEventsProvider>
            <ChatsProvider>
              <DeviceFrame>
                <AppRouter />
              </DeviceFrame>
            </ChatsProvider>
          </CalendarEventsProvider>
        </ConnectionsProvider>
      </AuthProvider>
    </ProfileProvider>
  );
}

// Inner component — has access to AuthContext
function AppRouter() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();

  // Always allow public paths through
  if (PUBLIC_PATHS.includes(pathname)) {
    return <Outlet />;
  }

  // While Supabase resolves session, show a minimal spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F0F4FF]">
        <div style={{
          animation: "spin 0.9s linear infinite",
          width: 28, height: 28,
          borderRadius: "50%",
          border: "3px solid #E2E8F0",
          borderTopColor: "#0A7CFF",
        }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Not signed in → go to splash
  if (!user) {
    return <Navigate to="/splash" replace />;
  }

  // Signed in but hasn't completed onboarding
  if (!isOnboardingComplete()) {
    return <Navigate to="/onboarding" replace />;
  }

  return <ScrollToTopLayout />;
}

export function ScrollToTopLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = document.querySelector('[data-device-scroll]');
    if (el) el.scrollTop = 0;
  }, [pathname]);

  return <Outlet />;
}
