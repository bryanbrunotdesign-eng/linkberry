import { useNavigate } from "react-router";
import { useCallback } from "react";

/**
 * Returns a goBack function that navigates to the previous page in history.
 * If there's no previous page (e.g., user landed directly on this URL),
 * it falls back to the provided fallback route (default "/").
 */
export function useGoBack(fallback: string = "/") {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    // React Router stores an index in history.state for the current entry.
    // idx > 0 means there's a real previous page within the app session.
    const idx = (window.history.state as { idx?: number })?.idx;
    if (typeof idx === "number" && idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  }, [navigate, fallback]);

  return goBack;
}
