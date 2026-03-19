import { useState, useEffect } from "react";

/**
 * Detects whether the mobile virtual keyboard is currently visible
 * using the Visual Viewport API. Returns true when the viewport
 * shrinks significantly (keyboard opened).
 */
export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const threshold = 150; // px — keyboard is typically 250-400px tall

    const handleResize = () => {
      const heightDiff = window.innerHeight - vv.height;
      setIsKeyboardVisible(heightDiff > threshold);
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  return isKeyboardVisible;
}
