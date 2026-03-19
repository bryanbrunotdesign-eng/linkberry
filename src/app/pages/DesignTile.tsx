import { ChevronLeft, ChevronRight, ChevronDown, Save, Trash2, Plus, X, Clock, Share2, Bell, Search, MapPin, Calendar as CalendarIcon, Users, Star, Heart, MessageCircle } from "lucide-react";

// ─── Section wrapper ───
function Section({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) {
  return (
    <div className="mb-10">
      <div className="px-4 mb-4">
        <h2 className="font-['Rethink_Sans',sans-serif] font-bold text-lg text-[#0D1117]">{title}</h2>
        {description && (
          <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mt-1">{description}</p>
        )}
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

// ─── Swatch ───
function Swatch({ color, name, token, textDark = true }: { color: string; name: string; token: string; textDark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-xl border border-[#E2E8F0] flex-shrink-0 flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <span className={`font-mono text-[8px] ${textDark ? 'text-[#0D1117]/60' : 'text-white/60'}`}>{color}</span>
      </div>
      <div className="min-w-0">
        <p className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117]">{name}</p>
        <p className="font-mono text-[10px] text-[#718096]">{token}</p>
      </div>
    </div>
  );
}

export default function DesignTile() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Dev header */}
      <div className="bg-[#0D1117] px-4 pt-12 pb-6">
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Developer Reference</p>
        <h1 className="font-['Rethink_Sans',sans-serif] font-bold text-2xl text-white">Design System</h1>
        <p className="font-['Open_Sans',sans-serif] text-xs text-white/50 mt-1">Linkberry v5 &middot; All tokens, components &amp; patterns</p>
      </div>

      <div className="pt-6">

        {/* ═══════════ COLORS ═══════════ */}
        <Section title="Brand Colors" description="Primary palette used across the app">
          <div className="grid grid-cols-2 gap-4">
            <Swatch color="#0D1117" name="Main / Dark" token="--brand-main" textDark={false} />
            <Swatch color="#0A7CFF" name="Brand Accent" token="--brand-accent" textDark={false} />
            <Swatch color="#0057B8" name="Brand 400" token="--brand-400" textDark={false} />
            <Swatch color="#2E9BF5" name="Brand 300" token="--brand-300" textDark={false} />
            <Swatch color="#7BC8FF" name="Brand 200" token="--brand-200" />
            <Swatch color="#E0F2FF" name="Brand 100" token="--brand-100" />
          </div>
        </Section>

        <Section title="Secondary / Coral" description="CTAs, badges, destructive actions">
          <div className="grid grid-cols-2 gap-4">
            <Swatch color="#FF5C3A" name="Coral 300" token="--secondary-300" textDark={false} />
            <Swatch color="#FF8C6B" name="Coral 200" token="--secondary-200" textDark={false} />
            <Swatch color="#FFF0EC" name="Coral 100" token="--secondary-100" />
          </div>
        </Section>

        <Section title="Gold / Champagne" description="Streak, premium, goal accents">
          <div className="grid grid-cols-2 gap-4">
            <Swatch color="#C9963A" name="Gold 300" token="--gold-300" textDark={false} />
            <Swatch color="#F0C875" name="Gold 200" token="--gold-200" />
            <Swatch color="#FDF6E3" name="Gold 100" token="--gold-100" />
          </div>
        </Section>

        <Section title="Neutrals & Surfaces" description="Backgrounds, borders, muted text">
          <div className="grid grid-cols-2 gap-4">
            <Swatch color="#FFFFFF" name="Background" token="--background" />
            <Swatch color="#F7F8FA" name="Surface / Cards" token="--cards" />
            <Swatch color="#E2E8F0" name="Borders" token="--neutral-200" />
            <Swatch color="#A0AEC0" name="Neutral 300" token="--neutral-300" />
            <Swatch color="#718096" name="Neutral 400" token="--neutral-400" textDark={false} />
            <Swatch color="#4A5568" name="Neutral 500" token="--neutral-500" textDark={false} />
            <Swatch color="#1E2A3A" name="Dark Surface" token="TodaySchedule/GoalCard" textDark={false} />
          </div>
        </Section>

        {/* ═══════════ TYPOGRAPHY ═══════════ */}
        <Section title="Typography" description="Two-font system: Rethink Sans + Open Sans">
          <div className="space-y-6">
            {/* Rethink Sans */}
            <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0]">
              <p className="font-mono text-[10px] text-[#A0AEC0] uppercase tracking-wider mb-3">Rethink Sans</p>
              <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] mb-4">Headers, display, navigation, buttons</p>
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Bold 800 — App title</p>
                  <p className="font-['Rethink_Sans',sans-serif] font-extrabold text-2xl text-[#0D1117]">Linkberry</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Semibold 700 — Page headers</p>
                  <p className="font-['Rethink_Sans',sans-serif] font-bold text-xl text-[#0D1117]">My Events</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Semibold 600 — Section titles</p>
                  <p className="font-['Rethink_Sans',sans-serif] font-semibold text-lg text-[#0D1117]">Recommended for You</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Medium 500 — Card titles, nav labels</p>
                  <p className="font-['Rethink_Sans',sans-serif] font-medium text-sm text-[#0D1117]">AI & Future of Work Mixer</p>
                </div>
              </div>
            </div>

            {/* Open Sans */}
            <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0]">
              <p className="font-mono text-[10px] text-[#A0AEC0] uppercase tracking-wider mb-3">Open Sans</p>
              <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] mb-4">Body, descriptions, labels, form inputs</p>
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Semibold 600 — Button labels, badges</p>
                  <p className="font-['Open_Sans',sans-serif] font-semibold text-sm text-[#0D1117]">Register Now</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Regular 400 — Body text</p>
                  <p className="font-['Open_Sans',sans-serif] text-sm text-[#0D1117]">Join industry leaders for an evening of networking and insights into emerging tech trends.</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Regular 400 — Secondary / meta</p>
                  <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096]">Jun 15, 2024 &middot; 2:00 PM – 4:00 PM</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">Light 300 Italic — Notes / chalk style</p>
                  <p className="font-['Open_Sans',sans-serif] italic font-light text-sm text-[#4A5568]">Remember to follow up with Sarah about the deck...</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#A0AEC0] mb-0.5">10px Uppercase — Micro labels, stats</p>
                  <p className="font-['Open_Sans',sans-serif] text-[10px] tracking-[0.08em] text-[#A0AEC0] uppercase">My Networking Stats</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ BUTTONS ═══════════ */}
        <Section title="Buttons" description="All CTA buttons use rounded-xl">
          <div className="space-y-4">
            {/* Primary CTA */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Primary CTA — Brand Accent</p>
              <button className="w-full bg-[#0A7CFF] text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-3 rounded-xl">
                Register for Event
              </button>
            </div>

            {/* Coral CTA */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Coral CTA — Send Tap to Meet</p>
              <button className="w-full bg-[#FF5C3A] text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" /> Send Tap to Meet
              </button>
            </div>

            {/* Connect / Tap Sent */}
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Connect — Default</p>
                <button className="w-full bg-[#2E9BF5] text-white font-['Open_Sans',sans-serif] text-xs font-semibold py-2 rounded-xl">
                  Connect
                </button>
              </div>
              <div className="flex-1">
                <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Connect — Tapped</p>
                <button className="w-full bg-[#F7F8FA] text-[#0A7CFF] border border-[#0A7CFF] font-['Open_Sans',sans-serif] text-xs font-semibold py-2 rounded-xl">
                  &#10003; Tap Sent
                </button>
              </div>
            </div>

            {/* Ghost / outline */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Ghost Button — Secondary action</p>
              <button className="w-full bg-white text-[#0D1117] border border-[#E2E8F0] font-['Rethink_Sans',sans-serif] font-semibold text-sm py-3 rounded-xl">
                View All Events
              </button>
            </div>

            {/* Dark / chalkboard button */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Chalkboard — Save Note (on dark bg)</p>
              <div className="bg-[#1A2332] rounded-xl p-4">
                <button className="w-full bg-white/15 text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 border border-white/10">
                  <Save className="w-4 h-4" /> Save Note
                </button>
              </div>
            </div>

            {/* Small action buttons */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Small Action — Apply (compact)</p>
              <div className="flex gap-3">
                <button className="bg-[#0A7CFF] text-white rounded-xl px-4 py-2 font-['Open_Sans',sans-serif] font-semibold text-xs">
                  Apply
                </button>
                <button className="bg-[#FF5C3A] text-white rounded-xl px-4 py-2 font-['Open_Sans',sans-serif] font-semibold text-xs">
                  Cancel
                </button>
                <button className="bg-[#F7F8FA] text-[#0D1117] border border-[#E2E8F0] rounded-xl px-4 py-2 font-['Open_Sans',sans-serif] font-semibold text-xs">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ BADGES / PILLS ═══════════ */}
        <Section title="Badges & Pills" description="Status indicators, event type pills, match percentages">
          <div className="space-y-4">
            {/* Event badge pills */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Event Badge Pills — Frosted glass, on images</p>
              <div className="flex gap-3 flex-wrap">
                <span className="bg-[#FF5C3A]/90 text-white px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-xs font-semibold backdrop-blur-sm shadow-sm">
                  Recommended
                </span>
                <span className="bg-[#0A7CFF]/90 text-white px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-xs font-semibold backdrop-blur-sm shadow-sm">
                  Upcoming
                </span>
              </div>
            </div>

            {/* Compact pills for thumbnails */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Compact Badge Pills — 80×80 thumbnails</p>
              <div className="flex gap-3">
                <span className="bg-[#FF5C3A] text-white px-1.5 py-0.5 rounded font-['Open_Sans',sans-serif] text-[9px] font-semibold">
                  Rec'd
                </span>
                <span className="bg-[#0A7CFF] text-white px-1.5 py-0.5 rounded font-['Open_Sans',sans-serif] text-[9px] font-semibold">
                  Soon
                </span>
              </div>
            </div>

            {/* Match percentage */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Match Percentage Badge</p>
              <div className="flex gap-3 items-center">
                <span className="bg-[#0A7CFF] text-white font-['Rethink_Sans',sans-serif] font-bold text-xs px-2 py-0.5 rounded-full">
                  92%
                </span>
                <span className="bg-[#E0F2FF] text-[#0A7CFF] font-['Rethink_Sans',sans-serif] font-bold text-xs px-2 py-0.5 rounded-full">
                  85%
                </span>
                <span className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096]">Match</span>
              </div>
            </div>

            {/* Note count pill */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Count Badges — Notes, notifications</p>
              <div className="flex gap-3 items-center">
                <span className="bg-white/20 text-white font-['Rethink_Sans',sans-serif] text-xs w-5 h-5 rounded-full flex items-center justify-center bg-[#1E2A3A]">
                  3
                </span>
                <div className="w-2 h-2 bg-[#FF5C3A] rounded-full" />
                <span className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096]">Notification dot</span>
              </div>
            </div>

            {/* Chip / tag pills */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Selection Chips — Registration flow</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[#0A7CFF] text-white px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-xs font-medium">
                  GenAI ✓
                </span>
                <span className="bg-[#F7F8FA] text-[#0D1117] px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-xs font-medium border border-[#E2E8F0]">
                  EdTech
                </span>
                <span className="bg-[#F7F8FA] text-[#0D1117] px-3 py-1.5 rounded-full font-['Open_Sans',sans-serif] text-xs font-medium border border-[#E2E8F0]">
                  Health Tech
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ CARDS ═══════════ */}
        <Section title="Cards" description="All cards: border border-[#E2E8F0], rounded-2xl">
          <div className="space-y-5">
            {/* Standard white card */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Standard Card — White bg, border, rounded-2xl</p>
              <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
                <h4 className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-[#0D1117] mb-1">Card Title</h4>
                <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096]">Card body description text lives here. Uses Open Sans regular.</p>
              </div>
            </div>

            {/* Surface card */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Surface Card — #F7F8FA bg (JobMatchCard, compact items)</p>
              <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0]">
                <h4 className="font-['Rethink_Sans',sans-serif] font-bold text-sm text-[#0D1117] mb-1">Surface Card</h4>
                <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096]">Used for nested cards, list items, job matches.</p>
              </div>
            </div>

            {/* Dark card */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Dark Card — #1E2A3A (TodaySchedule, GoalCard)</p>
              <div className="bg-[#1E2A3A] rounded-2xl p-4 border border-[#E2E8F0]">
                <h4 className="font-['Rethink_Sans',sans-serif] font-semibold text-sm text-white mb-1">Dark Surface Card</h4>
                <p className="font-['Open_Sans',sans-serif] text-xs text-white/60">Used for TodaySchedule and GoalCard/Notes chalkboard.</p>
              </div>
            </div>

            {/* Event thumbnail card */}
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Event Thumbnail — 80×80, carousel compact</p>
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl bg-[#E2E8F0] border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
                  <span className="font-mono text-[8px] text-[#A0AEC0]">80×80</span>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] mb-0.5">Organizer Name</p>
                  <p className="font-['Rethink_Sans',sans-serif] font-medium text-xs text-[#0D1117] line-clamp-2">Event Title Goes Here</p>
                  <p className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] mt-0.5">Jun 15 &middot; 2PM</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ ICONS ═══════════ */}
        <Section title="Icons" description="Lucide React — all chevrons w-5 h-5 text-[#0D1117]">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Navigation Chevrons — w-5 h-5 text-[#0D1117]</p>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1">
                  <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
                  <span className="font-mono text-[9px] text-[#718096]">Back</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChevronRight className="w-5 h-5 text-[#0D1117]" />
                  <span className="font-mono text-[9px] text-[#718096]">Forward</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChevronDown className="w-5 h-5 text-[#0D1117]" />
                  <span className="font-mono text-[9px] text-[#718096]">Expand</span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Action Icons — Various sizes</p>
              <div className="flex gap-4 items-center flex-wrap">
                {[
                  { Icon: Plus, label: "Add" },
                  { Icon: X, label: "Close" },
                  { Icon: Save, label: "Save" },
                  { Icon: Trash2, label: "Delete" },
                  { Icon: Clock, label: "Time" },
                  { Icon: Share2, label: "Share" },
                  { Icon: Bell, label: "Notify" },
                  { Icon: Search, label: "Search" },
                  { Icon: MapPin, label: "Location" },
                  { Icon: CalendarIcon, label: "Calendar" },
                  { Icon: Users, label: "People" },
                  { Icon: Star, label: "Star" },
                  { Icon: MessageCircle, label: "Chat" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5 text-[#0D1117]" />
                    <span className="font-mono text-[8px] text-[#A0AEC0]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ SPACING & LAYOUT ═══════════ */}
        <Section title="Spacing & Layout" description="Consistent padding, margins, and radii">
          <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0] space-y-3">
            {[
              { label: "Page horizontal padding", value: "px-4 (16px)" },
              { label: "Card outer margin", value: "mx-4 mb-4" },
              { label: "Card border radius", value: "rounded-2xl (16px)" },
              { label: "Button border radius", value: "rounded-xl (12px)" },
              { label: "Avatar border radius", value: "rounded-xl (12px) — was rounded-full" },
              { label: "Thumbnail size", value: "w-20 h-20 (80×80)" },
              { label: "Profile avatar (header)", value: "w-9 h-9 (36px) rounded-full" },
              { label: "Card border", value: "border border-[#E2E8F0]" },
              { label: "Card shadow (GoalCard)", value: "0 2px 8px rgba(0,0,0,0.15)" },
              { label: "Bottom nav height", value: "~60px + pb-safe" },
              { label: "Header top padding", value: "pt-12 (48px, status bar)" },
              { label: "Section header margin", value: "px-4 mb-2" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-baseline gap-2">
                <span className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117]">{item.label}</span>
                <span className="font-mono text-[10px] text-[#0A7CFF] flex-shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════ NAVIGATION PATTERNS ═══════════ */}
        <Section title="Navigation Patterns" description="Back arrows, bottom nav, routing">
          <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0] space-y-3">
            {[
              { label: "Router", value: "react-router (not react-router-dom)" },
              { label: "Back navigation", value: "useGoBack() hook — 7 pages" },
              { label: "Back arrow", value: "ChevronLeft w-5 h-5 text-[#0D1117]" },
              { label: "Bottom nav tabs", value: "Home, My Events, Calendar, Chats" },
              { label: "Active nav color", value: "#0A7CFF with /10 bg pill" },
              { label: "Nav label font", value: "Open Sans 10px" },
              { label: "Route layout", value: "RootLayout > ScrollToTopLayout > pages" },
              { label: "Providers in RootLayout", value: "CalendarEventsProvider, ConnectionsProvider" },
              { label: "DeviceFrame", value: "Wraps content, iPhone 15 Pro bezel on desktop" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-baseline gap-2">
                <span className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117]">{item.label}</span>
                <span className="font-mono text-[10px] text-[#0A7CFF] flex-shrink-0 text-right max-w-[55%]">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════ BOTTOM SHEETS ═══════════ */}
        <Section title="Bottom Sheets & Modals" description="Slide-up overlays with scroll lock">
          <div className="space-y-3">
            <div className="bg-white rounded-t-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
              </div>
              <div className="px-4 pb-4">
                <h3 className="font-['Rethink_Sans',sans-serif] font-semibold text-base text-[#0D1117] mb-1">Sheet Title</h3>
                <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] mb-3">Bottom sheets use a drag handle, rounded-t-2xl, and animate-slide-up. Managed with useScrollLock (ref counting).</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#0A7CFF] text-white font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2.5 rounded-xl">Confirm</button>
                  <button className="flex-1 bg-[#F7F8FA] text-[#0D1117] border border-[#E2E8F0] font-['Rethink_Sans',sans-serif] font-semibold text-sm py-2.5 rounded-xl">Cancel</button>
                </div>
              </div>
            </div>
            <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0] space-y-2">
              {[
                { label: "Animation", value: "animate-slide-up (0.3s ease-out)" },
                { label: "Backdrop", value: "bg-black/50, onClick close" },
                { label: "Scroll lock", value: "useScrollLock with ref counting" },
                { label: "Registration flow", value: "3-step: form → registered → added" },
                { label: "AddBlockSheet", value: "Calendar event creation" },
                { label: "EventDetailSheet", value: "Calendar event details" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-baseline gap-2">
                  <span className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117]">{item.label}</span>
                  <span className="font-mono text-[10px] text-[#0A7CFF] flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════ FORM INPUTS ═══════════ */}
        <Section title="Form Inputs" description="Inputs, textareas, selectors">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Standard Input — Light bg</p>
              <input
                type="text"
                readOnly
                value="placeholder@email.com"
                className="w-full bg-[#F7F8FA] rounded-xl px-4 py-3 font-['Open_Sans',sans-serif] text-sm text-[#0D1117] border border-[#E2E8F0] outline-none"
              />
            </div>
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Dark Input — Chalkboard context</p>
              <div className="bg-[#1A2332] rounded-xl p-4">
                <input
                  type="text"
                  readOnly
                  value="Note title..."
                  className="w-full bg-transparent font-['Rethink_Sans',sans-serif] font-semibold text-sm text-white border-none outline-none"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] text-[#A0AEC0] mb-2">Dropdown Select</p>
              <div className="w-full bg-[#F7F8FA] rounded-xl px-4 py-3 font-['Open_Sans',sans-serif] text-sm text-[#718096] border border-[#E2E8F0] flex items-center justify-between">
                <span>Select your role...</span>
                <ChevronDown className="w-5 h-5 text-[#0D1117]" />
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ STATE PATTERNS ═══════════ */}
        <Section title="State & Data" description="Contexts, localStorage keys, utilities">
          <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0] space-y-3">
            {[
              { label: "CalendarEventsContext", value: "localStorage v5" },
              { label: "ConnectionsContext", value: "Connection state syncing" },
              { label: "Notes storage key", value: "linkberry_notes_v1" },
              { label: "App date utility", value: "getAppToday() / getAppNow()" },
              { label: "Pinned date", value: "Thursday, June 13, 2024" },
              { label: "Scroll behavior", value: "ScrollToTopLayout on route change" },
              { label: "Device cursor", value: "24×24 circle, pointer:fine, [data-device-scroll]" },
              { label: "Keyboard detection", value: "useKeyboardVisible — hides BottomNav" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-baseline gap-2">
                <span className="font-['Open_Sans',sans-serif] text-xs text-[#0D1117]">{item.label}</span>
                <span className="font-mono text-[10px] text-[#0A7CFF] flex-shrink-0 text-right max-w-[55%]">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════ COMPONENT INDEX ═══════════ */}
        <Section title="Component Index" description="All shared components and their locations">
          <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0] space-y-2">
            {[
              { comp: "Header", path: "components/Header.tsx" },
              { comp: "BottomNav", path: "components/BottomNav.tsx" },
              { comp: "SectionHeader", path: "components/SectionHeader.tsx" },
              { comp: "EventCard", path: "components/EventCard.tsx" },
              { comp: "ProfileMatchCard", path: "components/ProfileMatchCard.tsx" },
              { comp: "JobMatchCard", path: "components/JobMatchCard.tsx" },
              { comp: "MatchConnectButton", path: "components/MatchConnectButton.tsx" },
              { comp: "TodaySchedule", path: "components/TodaySchedule.tsx" },
              { comp: "StatsIndicators", path: "components/StatsIndicators.tsx" },
              { comp: "GoalCard (Notes)", path: "components/GoalCard.tsx" },
              { comp: "EventRegistrationFlow", path: "components/EventRegistrationFlow.tsx" },
              { comp: "DeviceFrame", path: "components/DeviceFrame.tsx" },
              { comp: "ScrollToTopLayout", path: "components/ScrollToTop.tsx" },
              { comp: "CalendarHeader", path: "components/calendar/CalendarHeader.tsx" },
              { comp: "CalendarBlock", path: "components/calendar/CalendarBlock.tsx" },
              { comp: "AddBlockSheet", path: "components/calendar/AddBlockSheet.tsx" },
              { comp: "EventDetailSheet", path: "components/calendar/EventDetailSheet.tsx" },
              { comp: "SmartSuggestions", path: "components/calendar/SmartSuggestions.tsx" },
              { comp: "DatePickerModal", path: "components/calendar/DatePickerModal.tsx" },
              { comp: "TimePicker", path: "components/calendar/TimePicker.tsx" },
            ].map((item) => (
              <div key={item.comp} className="flex justify-between items-baseline gap-2">
                <span className="font-['Rethink_Sans',sans-serif] font-medium text-xs text-[#0D1117]">{item.comp}</span>
                <span className="font-mono text-[9px] text-[#718096] flex-shrink-0">{item.path}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════ PAGES / ROUTES ═══════════ */}
        <Section title="Pages & Routes" description="All registered routes">
          <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E2E8F0] space-y-2">
            {[
              { route: "/", page: "Dashboard" },
              { route: "/calendar", page: "Calendar" },
              { route: "/my-events", page: "MyEvents" },
              { route: "/event/:id", page: "EventDetail (IDs 1–9)" },
              { route: "/recommended-events", page: "RecommendedEvents" },
              { route: "/recommended-people", page: "RecommendedPeople" },
              { route: "/all-events", page: "AllEvents" },
              { route: "/profile/:id", page: "ProfileDetail (8 people)" },
              { route: "/my-profile", page: "UserProfile" },
              { route: "/designtile", page: "DesignTile (this page)" },
            ].map((item) => (
              <div key={item.route} className="flex justify-between items-baseline gap-2">
                <span className="font-mono text-xs text-[#0A7CFF]">{item.route}</span>
                <span className="font-['Open_Sans',sans-serif] text-[10px] text-[#718096] flex-shrink-0">{item.page}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="px-4 pb-8 pt-4">
          <div className="border-t border-[#E2E8F0] pt-4">
            <p className="font-mono text-[10px] text-[#A0AEC0] text-center">
              Linkberry Design System &middot; v5 &middot; Last updated Jun 13, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
