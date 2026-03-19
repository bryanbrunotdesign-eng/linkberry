import { Header } from "../components/Header";
import { StatsIndicators } from "../components/StatsIndicators";
import { TodaySchedule } from "../components/TodaySchedule";
import { GoalCard } from "../components/GoalCard";
import { EventCard } from "../components/EventCard";
import { SectionHeader } from "../components/SectionHeader";
import { ProfileMatchCard } from "../components/ProfileMatchCard";
import { BottomNav } from "../components/BottomNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { recommendedEvents, allEvents, recommendedPeople, scoreEvent } from "../data/events";
import { useProfile } from "../contexts/ProfileContext";
import React, { useState, useEffect, useMemo } from "react";

export default function Dashboard() {
  const { profile } = useProfile();

  // Sort recommended events by how well they match the user's onboarding profile
  const sortedRecommendedEvents = useMemo(
    () => [...recommendedEvents].sort((a, b) => scoreEvent(b, profile) - scoreEvent(a, profile)),
    [profile]
  );

  const recommendedEventsRef = useDragScroll();
  const peopleToMeetRef = useDragScroll();
  const allEventsRef = useDragScroll();

  const [scrollStates, setScrollStates] = useState({
    recommendedEvents: false,
    peopleToMeet: false,
    allEvents: false,
  });

  // Check if scrolled to end
  const checkScrollEnd = (el: HTMLDivElement | null, key: keyof typeof scrollStates) => {
    if (!el) return;
    // Only report "at end" if there's actual scrollable overflow AND we've scrolled past the start
    const hasOverflow = el.scrollWidth > el.clientWidth + 5;
    const isAtEnd = hasOverflow && el.scrollLeft > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    setScrollStates(prev => ({ ...prev, [key]: isAtEnd }));
  };

  // Set up scroll listeners
  useEffect(() => {
    const handleScroll = (ref: React.RefObject<HTMLDivElement>, key: keyof typeof scrollStates) => () => {
      checkScrollEnd(ref.current, key);
    };

    const recommendedScroll = handleScroll(recommendedEventsRef, 'recommendedEvents');
    const peopleScroll = handleScroll(peopleToMeetRef, 'peopleToMeet');
    const allEventsScroll = handleScroll(allEventsRef, 'allEvents');

    const recommendedEl = recommendedEventsRef.current;
    const peopleEl = peopleToMeetRef.current;
    const allEventsEl = allEventsRef.current;

    recommendedEl?.addEventListener('scroll', recommendedScroll);
    peopleEl?.addEventListener('scroll', peopleScroll);
    allEventsEl?.addEventListener('scroll', allEventsScroll);

    // Delay initial check to ensure layout is settled (images, fonts, etc.)
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        checkScrollEnd(recommendedEl, 'recommendedEvents');
        checkScrollEnd(peopleEl, 'peopleToMeet');
        checkScrollEnd(allEventsEl, 'allEvents');
      }, 50);
    });

    return () => {
      cancelAnimationFrame(raf);
      recommendedEl?.removeEventListener('scroll', recommendedScroll);
      peopleEl?.removeEventListener('scroll', peopleScroll);
      allEventsEl?.removeEventListener('scroll', allEventsScroll);
    };
  }, []);

  // Scroll handlers for section chevrons
  const scrollToNext = (ref: React.RefObject<HTMLDivElement>, isAtEnd: boolean) => {
    if (ref.current) {
      const cardWidth = 270 + 12; // card width (270px) + gap (12px)
      if (isAtEnd) {
        // Scroll back to beginning
        ref.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll forward
        ref.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen font-['Open_Sans',sans-serif] pb-24">
      <Header />
      <div className="mx-4 mt-3 mb-3 bg-white rounded-2xl border border-[#E2E8F0]">
        <StatsIndicators />
      </div>
      <div className="mx-4 mb-4">
        <TodaySchedule />
      </div>
      <GoalCard />

      {/* Recommended Events */}
      <div className="mb-4">
        <SectionHeader title="Recommended Events" linkTo="/recommended-events" onChevronClick={() => scrollToNext(recommendedEventsRef, scrollStates.recommendedEvents)} isAtEnd={scrollStates.recommendedEvents} />
        <div className="overflow-x-auto scrollbar-hide" ref={recommendedEventsRef}>
          <div className="flex gap-3 px-4">
            {sortedRecommendedEvents.map((event) => (
              <EventCard key={event.id} {...event} badge="recommended" />
            ))}
          </div>
        </div>
      </div>

      {/* Recommended People */}
      <div className="mb-4">
        <SectionHeader title="Recommended People" linkTo="/recommended-people" onChevronClick={() => scrollToNext(peopleToMeetRef, scrollStates.peopleToMeet)} isAtEnd={scrollStates.peopleToMeet} />
        <div className="overflow-x-auto scrollbar-hide" ref={peopleToMeetRef}>
          <div className="flex gap-3 px-4">
            {recommendedPeople.map((profile, index) => (
              <ProfileMatchCard key={profile.id} {...profile} />
            ))}
          </div>
        </div>
      </div>

      {/* All Events */}
      <div className="mb-4">
        <SectionHeader title="All Events" linkTo="/all-events" onChevronClick={() => scrollToNext(allEventsRef, scrollStates.allEvents)} isAtEnd={scrollStates.allEvents} />
        <div className="overflow-x-auto scrollbar-hide" ref={allEventsRef}>
          <div className="flex gap-3 px-4">
            {allEvents.map((event) => (
              <EventCard key={event.id} {...event} badge="upcoming" />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}