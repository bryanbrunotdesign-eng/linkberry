import { useRef, useCallback, useEffect } from 'react';

export function useDragScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const applyMomentum = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    velocity.current *= 0.95; // Deceleration

    if (Math.abs(velocity.current) > 0.5) {
      el.scrollLeft -= velocity.current;
      animationFrame.current = requestAnimationFrame(applyMomentum);
    } else {
      velocity.current = 0;
      animationFrame.current = null;
    }
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 2;
    el.scrollLeft = scrollLeft.current - walk;

    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - lastTime.current;
    if (timeDelta > 0) {
      const distance = e.pageX - lastX.current;
      velocity.current = (distance / timeDelta) * 16;
    }
    lastX.current = e.pageX;
    lastTime.current = now;
  }, []);

  const handleMouseUp = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.style.cursor = 'grab';
    el.style.userSelect = 'auto';

    // Start momentum scroll
    if (Math.abs(velocity.current) > 0.5) {
      applyMomentum();
    }
  }, [applyMomentum]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = false;
    el.style.cursor = 'grab';
    el.style.userSelect = 'auto';

    if (Math.abs(velocity.current) > 0.5) {
      applyMomentum();
    }
  }, [applyMomentum]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.touches[0].pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    lastX.current = e.touches[0].pageX;
    lastTime.current = Date.now();
    velocity.current = 0;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startX.current) * 2;
    el.scrollLeft = scrollLeft.current - walk;

    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - lastTime.current;
    if (timeDelta > 0) {
      const distance = e.touches[0].pageX - lastX.current;
      velocity.current = (distance / timeDelta) * 16;
    }
    lastX.current = e.touches[0].pageX;
    lastTime.current = now;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;

    // Start momentum scroll
    if (Math.abs(velocity.current) > 0.5) {
      applyMomentum();
    }
  }, [applyMomentum]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchEnd);
    el.style.cursor = 'grab';

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return scrollRef;
}