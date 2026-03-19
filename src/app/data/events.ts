import { UserProfileData } from "../contexts/ProfileContext";

export interface EventItem {
  id: string;
  imageUrl: string;
  organizer: string;
  title: string;
  date: string;
  time: string;
  tags: string[];   // maps to onboarding goals / industries / intent values
  format: string;   // maps to onboarding eventPreferences values
}

export interface PersonItem {
  id: string;
  imageUrl: string;
  name: string;
  matchPercentage: number;
  title: string;
  company: string;
  bio?: string;
  location?: string;
  skills?: string[];
  mutualConnections?: number;
  eventsAttending?: string[];
  linkedin?: string;
  experience?: { role: string; company: string; duration: string }[];
}

/**
 * Score an event against a user profile.
 * Returns a number 0–100 (higher = better match).
 */
export function scoreEvent(event: EventItem, profile: Partial<UserProfileData>): number {
  const userTerms = [
    ...(profile.goals ?? []),
    ...(profile.industries ?? []),
    ...(profile.intent ?? []),
  ].map((t) => t.toLowerCase());

  const prefFormats = (profile.eventPreferences ?? []).map((p) => p.toLowerCase());

  let score = 0;
  for (const tag of event.tags) {
    if (userTerms.includes(tag.toLowerCase())) score += 15;
  }
  if (prefFormats.includes(event.format.toLowerCase())) score += 20;

  return Math.min(score, 100);
}

export const recommendedEvents: EventItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBjb25mZXJlbmNlJTIwbmV0d29ya2luZyUyMGV2ZW50fGVufDF8fHx8MTc3MzM1NTYzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "TechVentures Inc",
    title: "AI Revolution Summit 2026",
    date: "Thursday, March 26, 2026",
    time: "9:00 AM - 5:00 PM",
    tags: ["AI", "Technology", "Networking", "Innovation"],
    format: "Conference",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1599592187465-6dc742367282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwcGl0Y2glMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzczMjgwMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Venture Capital Network",
    title: "Startup Pitch Night: Series A Edition",
    date: "Tuesday, March 31, 2026",
    time: "6:00 PM - 9:00 PM",
    tags: ["Startups", "Fundraising", "Entrepreneurship", "Investing"],
    format: "Networking",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvcmtzaG9wJTIwc2VtaW5hcnxlbnwxfHx8fDE3NzMyNjQwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Business Leaders Alliance",
    title: "Strategic Leadership Workshop 2026",
    date: "Wednesday, April 1, 2026",
    time: "1:00 PM - 4:30 PM",
    tags: ["Leadership", "Management", "Career Growth", "Business"],
    format: "Workshop",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1637073849667-91120a924221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBoYWNrYXRob24lMjBkZXZlbG9wZXJzfGVufDF8fHx8MTc3MzE2Mzg1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "DevCommunity Hub",
    title: "48-Hour AI Hackathon Challenge",
    date: "Friday, April 3, 2026",
    time: "8:00 AM - 8:00 PM",
    tags: ["AI", "Engineering", "Startups", "Innovation"],
    format: "Hackathon",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1648134859177-525771773915?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMG1lZXR1cHxlbnwxfHx8fDE3NzMyODE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Data Science Collective",
    title: "Machine Learning & Analytics Symposium",
    date: "Tuesday, April 7, 2026",
    time: "2:00 PM - 7:00 PM",
    tags: ["AI", "Data Science", "Technology", "Engineering"],
    format: "Conference",
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1647013302881-3f19103fd9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczMjgxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "UX Design Guild",
    title: "Design Systems Masterclass 2026",
    date: "Thursday, April 9, 2026",
    time: "10:00 AM - 3:00 PM",
    tags: ["Design", "Product", "Creative", "Technology"],
    format: "Workshop",
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1642354984104-90e16a092c47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvJTIwY29uZmVyZW5jZSUyMHN0YWdlfGVufDF8fHx8MTc3MzM1OTI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Web3 Builders Guild",
    title: "Blockchain & Decentralized Tech Expo",
    date: "Tuesday, April 14, 2026",
    time: "10:00 AM - 6:00 PM",
    tags: ["Web3", "Blockchain", "Finance", "Technology"],
    format: "Conference",
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1761838897754-b5574cf222f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGdyZWVuJTIwdGVjaCUyMHN1bW1pdCUyMHBhbmVsfGVufDF8fHx8MTc3MzM1OTI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "GreenTech Alliance",
    title: "Sustainability & CleanTech Summit 2026",
    date: "Thursday, April 16, 2026",
    time: "9:00 AM - 4:00 PM",
    tags: ["Sustainability", "CleanTech", "Innovation", "Investing"],
    format: "Conference",
  },
  // New events
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    organizer: "Linkberry Community",
    title: "Casual Coffee & Connect",
    date: "Friday, March 27, 2026",
    time: "8:00 AM - 10:00 AM",
    tags: ["Networking", "Community", "Career Growth"],
    format: "Casual Meetup",
  },
  {
    id: "10",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    organizer: "AI Thinkers Collective",
    title: "AI Salon: Future of Intelligent Systems",
    date: "Tuesday, April 7, 2026",
    time: "6:30 PM - 9:00 PM",
    tags: ["AI", "Innovation", "Technology", "Research"],
    format: "Panel",
  },
  {
    id: "11",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    organizer: "HealthTech Innovators",
    title: "Digital Health & Wellness Summit 2026",
    date: "Thursday, May 21, 2026",
    time: "9:00 AM - 5:00 PM",
    tags: ["Healthcare", "Technology", "Innovation", "Research"],
    format: "Conference",
  },
  {
    id: "12",
    imageUrl: "https://images.unsplash.com/photo-1639503547276-90230c4a4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwY29uZmVyZW5jZSUyMHNwZWFrZXJzfGVufDF8fHx8MTc3MzM1OTI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "CyberSec Forum",
    title: "Cybersecurity Defense Conference 2026",
    date: "Tuesday, May 12, 2026",
    time: "8:30 AM - 5:30 PM",
    tags: ["Cybersecurity", "Technology", "Engineering", "Innovation"],
    format: "Conference",
  },
];

export const allEvents: EventItem[] = [...recommendedEvents];

export const recommendedPeople: PersonItem[] = [
  {
    id: "p1",
    imageUrl: "https://images.unsplash.com/photo-1701096351544-7de3c7fa0272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MzE5NzkwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Sophia Martinez",
    matchPercentage: 94,
    title: "Product Designer",
    company: "Adobe Creative",
    bio: "Passionate product designer with 8+ years crafting user-centered digital experiences. I specialize in design systems, accessibility, and bridging the gap between design and engineering. Always looking to connect with fellow creators pushing the boundaries of what's possible.",
    location: "San Francisco, CA",
    skills: ["Product Design", "Design Systems", "Figma", "User Research", "Accessibility", "Prototyping"],
    mutualConnections: 12,
    eventsAttending: ["Design Systems Masterclass 2026", "AI Revolution Summit 2026"],
    experience: [
      { role: "Senior Product Designer", company: "Adobe Creative", duration: "2021 - Present" },
      { role: "Product Designer", company: "Figma", duration: "2018 - 2021" },
      { role: "UI/UX Designer", company: "InVision", duration: "2016 - 2018" }
    ]
  },
  {
    id: "p2",
    imageUrl: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzMyNTg3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "David Thompson",
    matchPercentage: 89,
    title: "AI Research Lead",
    company: "OpenAI Labs",
    bio: "Leading cutting-edge research in large language models and reinforcement learning. Previously at DeepMind. I love connecting with founders, engineers, and product thinkers exploring how AI can transform industries responsibly.",
    location: "San Francisco, CA",
    skills: ["Machine Learning", "NLP", "Python", "Research", "LLMs", "Deep Learning"],
    mutualConnections: 8,
    eventsAttending: ["AI Revolution Summit 2026", "Machine Learning & Analytics Symposium"],
    experience: [
      { role: "AI Research Lead", company: "OpenAI Labs", duration: "2022 - Present" },
      { role: "Research Scientist", company: "DeepMind", duration: "2019 - 2022" },
      { role: "ML Engineer", company: "Google Brain", duration: "2017 - 2019" }
    ]
  },
  {
    id: "p3",
    imageUrl: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwYXNpYW58ZW58MXx8fHwxNzczMjgxNTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Amy Zhang",
    matchPercentage: 92,
    title: "VP Engineering",
    company: "Meta Platforms",
    bio: "Engineering leader managing 200+ engineers across infrastructure and product teams. Advocate for diversity in tech and mentoring the next generation of engineering leaders. Open to conversations about scaling teams, tech culture, and innovation.",
    location: "Menlo Park, CA",
    skills: ["Engineering Leadership", "System Architecture", "Team Scaling", "Cloud Infrastructure", "Mentorship"],
    mutualConnections: 15,
    eventsAttending: ["Strategic Leadership Workshop 2026"],
    experience: [
      { role: "VP Engineering", company: "Meta Platforms", duration: "2021 - Present" },
      { role: "Senior Director, Engineering", company: "Uber", duration: "2018 - 2021" },
      { role: "Engineering Manager", company: "Amazon", duration: "2015 - 2018" }
    ]
  },
  {
    id: "p4",
    imageUrl: "https://images.unsplash.com/photo-1561515075-551b90143acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRyZXByZW5ldXIlMjBoZWFkc2hvdCUyMGJsYWNrfGVufDF8fHx8MTc3MzI4MTUwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Marcus Williams",
    matchPercentage: 87,
    title: "Founder & CEO",
    company: "TechVentures Inc",
    bio: "Serial entrepreneur on my third startup. Building the future of enterprise collaboration. YC alum, Forbes 30 Under 30. I'm always up for a coffee chat about fundraising, product-market fit, and building resilient teams.",
    location: "New York, NY",
    skills: ["Entrepreneurship", "Fundraising", "Product Strategy", "Leadership", "B2B SaaS"],
    mutualConnections: 22,
    eventsAttending: ["Startup Pitch Night: Series A Edition", "Strategic Leadership Workshop 2026"],
    experience: [
      { role: "Founder & CEO", company: "TechVentures Inc", duration: "2022 - Present" },
      { role: "Co-Founder", company: "CollabSpace", duration: "2019 - 2022" },
      { role: "Product Manager", company: "Salesforce", duration: "2016 - 2019" }
    ]
  },
  {
    id: "p5",
    imageUrl: "https://images.unsplash.com/photo-1683348759141-da99061d8353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHRlY2glMjBoZWFkc2hvdCUyMGxhdGluYXxlbnwxfHx8fDE3NzMzNTk3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Isabella Rodriguez",
    matchPercentage: 91,
    title: "Growth Marketing Director",
    company: "Stripe",
    bio: "Data-driven growth marketer obsessed with PLG motions and community-led growth. I've scaled multiple products from 0 to 100K users. Love exchanging ideas about go-to-market strategies, brand building, and the intersection of marketing and product.",
    location: "Seattle, WA",
    skills: ["Growth Marketing", "PLG", "Analytics", "Brand Strategy", "Community Building", "SEO"],
    mutualConnections: 10,
    eventsAttending: ["AI Revolution Summit 2026"],
    experience: [
      { role: "Growth Marketing Director", company: "Stripe", duration: "2022 - Present" },
      { role: "Head of Growth", company: "Notion", duration: "2019 - 2022" },
      { role: "Growth Manager", company: "HubSpot", duration: "2017 - 2019" }
    ]
  },
  {
    id: "p6",
    imageUrl: "https://images.unsplash.com/photo-1722536626346-b2ece98dab92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdCUyMGluZGlhbiUyMGRldmVsb3BlcnxlbnwxfHx8fDE3NzMzNTk3NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Raj Patel",
    matchPercentage: 88,
    title: "Senior Staff Engineer",
    company: "Google Cloud",
    bio: "Distributed systems enthusiast with deep expertise in Kubernetes, microservices, and cloud-native architecture. I contribute to open-source projects and speak at conferences regularly. Let's connect if you're passionate about infrastructure at scale.",
    location: "Mountain View, CA",
    skills: ["Distributed Systems", "Kubernetes", "Go", "Cloud Architecture", "Open Source", "DevOps"],
    mutualConnections: 6,
    eventsAttending: ["48-Hour AI Hackathon Challenge"],
    experience: [
      { role: "Senior Staff Engineer", company: "Google Cloud", duration: "2020 - Present" },
      { role: "Staff Engineer", company: "Netflix", duration: "2017 - 2020" },
      { role: "Senior Engineer", company: "Dropbox", duration: "2014 - 2017" }
    ]
  },
  {
    id: "p7",
    imageUrl: "https://images.unsplash.com/photo-1758691737587-7630b4d31d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90JTIwYmxvbmRlJTIwY29ycG9yYXRlfGVufDF8fHx8MTc3MzM1OTc2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Emily Nordstrom",
    matchPercentage: 85,
    title: "Head of Partnerships",
    company: "Shopify",
    bio: "Building strategic partnerships that drive mutual growth. I focus on ecosystem plays, co-marketing, and API integrations. Passionate about connecting the dots between companies to create win-win outcomes.",
    location: "Toronto, Canada",
    skills: ["Business Development", "Partnerships", "Negotiation", "API Ecosystems", "E-commerce"],
    mutualConnections: 9,
    eventsAttending: ["Digital Health & Wellness Summit 2026"],
    experience: [
      { role: "Head of Partnerships", company: "Shopify", duration: "2021 - Present" },
      { role: "Director, BD", company: "Square", duration: "2018 - 2021" },
      { role: "Partnerships Manager", company: "PayPal", duration: "2015 - 2018" }
    ]
  },
  {
    id: "p8",
    imageUrl: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGJ1c2luZXNzbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzMzMzA2OTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Kevin Park",
    matchPercentage: 90,
    title: "CTO",
    company: "Notion",
    bio: "Technologist and leader passionate about building tools that amplify human creativity. I believe the best products come from deeply understanding user workflows. Open to discussing product engineering, team culture, and the future of productivity.",
    location: "San Francisco, CA",
    skills: ["Technical Leadership", "Product Engineering", "React", "TypeScript", "System Design", "Productivity Tools"],
    mutualConnections: 18,
    eventsAttending: ["AI Revolution Summit 2026", "Design Systems Masterclass 2026", "48-Hour AI Hackathon Challenge"],
    experience: [
      { role: "CTO", company: "Notion", duration: "2021 - Present" },
      { role: "VP Engineering", company: "Slack", duration: "2018 - 2021" },
      { role: "Engineering Lead", company: "Twitter", duration: "2015 - 2018" }
    ]
  }
];
