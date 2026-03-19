import { useNavigate, useParams, useLocation } from "react-router";
import { useGoBack } from "../hooks/useGoBack";
import { ChevronLeft, Users, Calendar, MapPin, Share2, Check, Sparkles, ChevronRight, X } from "lucide-react";
import { useState, useCallback, useRef, useMemo } from "react";
import { useCalendarEvents } from "../contexts/CalendarEventsContext";
import { CalendarBlockData, BlockKind } from "./Calendar";
import { EventRegistrationFlow, RegistrationData } from "../components/EventRegistrationFlow";
import { recommendedPeople } from "../data/events";
import { useScrollLock } from "../hooks/useScrollLock";
import { useConnections } from "../contexts/ConnectionsContext";
import { MatchConnectButton } from "../components/MatchConnectButton";

interface EventData {
  id: string;
  imageUrl: string;
  organizer: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: string;
  description: string;
  status: "upcoming" | "ongoing" | "past";
  category: string;
  speakers?: {
    name: string;
    title: string;
    company: string;
    imageUrl?: string;
  }[];
  agenda?: {
    time: string;
    title: string;
    description: string;
  }[];
}

// Mock event data - in a real app, this would come from an API
const mockEvents: Record<string, EventData> = {
  "1": {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBjb25mZXJlbmNlJTIwbmV0d29ya2luZyUyMGV2ZW50fGVufDF8fHx8MTc3MzM1NTYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    organizer: "TechVentures Inc",
    title: "AI Revolution Summit 2024",
    date: "Monday, March 18, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco, CA",
    attendeeCount: "530+",
    description: "The premier conference for AI innovation and product design",
    status: "upcoming",
    category: "Conference",
    speakers: [
      {
        name: "Dr. Sarah Chen",
        title: "Chief AI Officer",
        company: "OpenAI",
        imageUrl: "https://images.unsplash.com/photo-1758600587839-56ba05596c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjBjb3Jwb3JhdGV8ZW58MXx8fHwxNzczMzY5MzUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Michael Roberts",
        title: "VP of Product Design",
        company: "Adobe",
        imageUrl: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMGhlYWRzaG90JTIwc3VpdHxlbnwxfHx8fDE3NzMzMzgyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Jessica Wu",
        title: "Head of AI Research",
        company: "Google DeepMind",
        imageUrl: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwZXhlY3V0aXZlJTIwY29ycG9yYXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMzY5MzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    agenda: [
      {
        time: "9:00 AM - 9:30 AM",
        title: "Registration & Coffee",
        description: "Check-in and networking with fellow attendees"
      },
      {
        time: "9:30 AM - 10:30 AM",
        title: "Opening Keynote: The Future of AI",
        description: "Dr. Sarah Chen presents the latest breakthroughs in AI technology"
      },
      {
        time: "10:45 AM - 12:00 PM",
        title: "Panel: AI in Product Design",
        description: "Industry leaders discuss practical applications of AI in design workflows"
      },
      {
        time: "12:00 PM - 1:30 PM",
        title: "Networking Lunch",
        description: "Connect with speakers, sponsors, and attendees"
      },
      {
        time: "1:30 PM - 3:00 PM",
        title: "Hands-on Workshop: Building AI-Powered Prototypes",
        description: "Interactive session on implementing AI features in your products"
      },
      {
        time: "3:15 PM - 4:30 PM",
        title: "Breakout Sessions",
        description: "Choose from multiple tracks: Design Systems, User Research, or Development"
      },
      {
        time: "4:30 PM - 5:00 PM",
        title: "Closing Remarks & Next Steps",
        description: "Summary of key takeaways and networking opportunities"
      }
    ]
  },
  "2": {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1599592187465-6dc742367282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwcGl0Y2glMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzczMjgwMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Venture Capital Network",
    title: "Startup Pitch Night: Series A Edition",
    date: "Wednesday, March 20, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "New York City, NY",
    attendeeCount: "200+",
    description: "Watch promising startups pitch to top VCs and angel investors",
    status: "upcoming",
    category: "Networking",
    speakers: [
      {
        name: "David Park",
        title: "General Partner",
        company: "Sequoia Capital",
        imageUrl: "https://images.unsplash.com/photo-1741675121661-3ace9d68caba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzM2OTM1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Emma Rodriguez",
        title: "Managing Director",
        company: "a16z",
        imageUrl: "https://images.unsplash.com/photo-1631248621222-64bba871dc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbmElMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90JTIwc21pbGV8ZW58MXx8fHwxNzczMzI0MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    agenda: [
      {
        time: "6:00 PM - 6:30 PM",
        title: "Welcome Reception",
        description: "Networking with investors and entrepreneurs"
      },
      {
        time: "6:30 PM - 8:00 PM",
        title: "Startup Pitches",
        description: "10 startups present their vision (8 minutes each)"
      },
      {
        time: "8:00 PM - 8:30 PM",
        title: "Q&A Panel with Investors",
        description: "Get insights from top VCs on what they look for"
      },
      {
        time: "8:30 PM - 9:00 PM",
        title: "Networking & Drinks",
        description: "Connect with founders and investors"
      }
    ]
  },
  "3": {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvcmtzaG9wJTIwc2VtaW5hcnxlbnwxfHx8fDE3NzMyNjQwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Business Leaders Alliance",
    title: "Strategic Leadership Workshop 2024",
    date: "Monday, March 25, 2024",
    time: "1:00 PM - 4:30 PM",
    location: "Chicago, IL",
    attendeeCount: "150+",
    description: "Develop strategic thinking and leadership capabilities for modern business challenges",
    status: "upcoming",
    category: "Workshop",
    speakers: [
      {
        name: "Jennifer Collins",
        title: "CEO",
        company: "Fortune 500 Strategy Group",
        imageUrl: "https://images.unsplash.com/photo-1758691737587-7630b4d31d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9uZGUlMjB3b21hbiUyMGV4ZWN1dGl2ZSUyMGJ1c2luZXNzJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczMzY5MzU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Marcus Johnson",
        title: "Leadership Coach",
        company: "Executive Development Institute",
        imageUrl: "https://images.unsplash.com/photo-1679117349740-c46c819d0373?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMGNvcnBvcmF0ZSUyMGhlYWRzaG90fGVufDF8fHx8MTc3MzM2OTM1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    agenda: [
      {
        time: "1:00 PM - 1:30 PM",
        title: "Check-in & Introduction",
        description: "Welcome and workshop overview"
      },
      {
        time: "1:30 PM - 2:30 PM",
        title: "Strategic Thinking Frameworks",
        description: "Learn proven frameworks for strategic decision-making"
      },
      {
        time: "2:30 PM - 2:45 PM",
        title: "Break",
        description: "Coffee and networking"
      },
      {
        time: "2:45 PM - 3:45 PM",
        title: "Leadership Case Studies",
        description: "Interactive analysis of real-world leadership challenges"
      },
      {
        time: "3:45 PM - 4:30 PM",
        title: "Action Planning & Wrap-up",
        description: "Create your personal leadership action plan"
      }
    ]
  },
  "4": {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1637073849667-91120a924221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBoYWNrYXRob24lMjBkZXZlbG9wZXJzfGVufDF8fHx8MTc3MzE2Mzg1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "DevCommunity Hub",
    title: "48-Hour AI Hackathon Challenge",
    date: "Friday, March 29, 2024",
    time: "8:00 AM - 8:00 PM",
    location: "Austin, TX",
    attendeeCount: "300+",
    description: "Build innovative AI-powered applications in an intensive 48-hour coding marathon",
    status: "upcoming",
    category: "Hackathon",
    speakers: [
      {
        name: "Alex Chen",
        title: "CTO",
        company: "AI Innovations Inc",
        imageUrl: "https://images.unsplash.com/photo-1634040829222-d13d8a59c238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHRlY2glMjBzdGFydHVwJTIwZm91bmRlciUyMGhlYWRzaG90fGVufDF8fHx8MTc3MzM2OTM1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Sarah Williams",
        title: "Lead Developer Advocate",
        company: "Google Cloud",
        imageUrl: "https://images.unsplash.com/photo-1634078111185-8c26c5cbc294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRldmVsb3BlciUyMGFkdm9jYXRlJTIwdGVjaCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMzNjkzNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    agenda: [
      {
        time: "8:00 AM - 9:00 AM",
        title: "Registration & Team Formation",
        description: "Check-in and meet your team members"
      },
      {
        time: "9:00 AM - 10:00 AM",
        title: "Kickoff & Challenge Announcement",
        description: "Learn about the hackathon challenges and prizes"
      },
      {
        time: "10:00 AM - 6:00 PM",
        title: "Hacking Time!",
        description: "Build your AI-powered application with your team"
      },
      {
        time: "6:00 PM - 7:00 PM",
        title: "Project Presentations",
        description: "Teams present their solutions to judges"
      },
      {
        time: "7:00 PM - 8:00 PM",
        title: "Awards Ceremony & Networking",
        description: "Winners announced, prizes awarded, and closing celebration"
      }
    ]
  },
  "5": {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1648134859177-525771773915?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMG1lZXR1cHxlbnwxfHx8fDE3NzMyODE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "Data Science Collective",
    title: "Machine Learning & Analytics Symposium",
    date: "Friday, March 15, 2024",
    time: "2:00 PM - 7:00 PM",
    location: "Boston, MA",
    attendeeCount: "400+",
    description: "Deep dive into the latest ML techniques and data analytics strategies",
    status: "upcoming",
    category: "Symposium",
    speakers: [
      {
        name: "Dr. Rachel Kumar",
        title: "Head of Data Science",
        company: "Meta",
        imageUrl: "https://images.unsplash.com/photo-1749700332031-cf99864959ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGRhdGElMjBzY2llbnRpc3QlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzczMzY5MzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "James Martinez",
        title: "Principal ML Engineer",
        company: "Netflix",
        imageUrl: "https://images.unsplash.com/photo-1646227655718-dd721b681d91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMG1hbiUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczMzY5MzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    agenda: [
      {
        time: "2:00 PM - 2:30 PM",
        title: "Welcome & Networking",
        description: "Meet fellow data scientists and ML practitioners"
      },
      {
        time: "2:30 PM - 3:30 PM",
        title: "Keynote: Future of Machine Learning",
        description: "Dr. Rachel Kumar on emerging ML trends"
      },
      {
        time: "3:45 PM - 5:00 PM",
        title: "Technical Deep Dives",
        description: "Parallel sessions on advanced ML topics"
      },
      {
        time: "5:15 PM - 6:15 PM",
        title: "Hands-on Workshop",
        description: "Build and deploy a production ML model"
      },
      {
        time: "6:15 PM - 7:00 PM",
        title: "Panel Discussion & Q&A",
        description: "Industry leaders discuss ML best practices"
      }
    ]
  },
  "6": {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1647013302881-3f19103fd9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczMjgxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    organizer: "UX Design Guild",
    title: "Design Systems Masterclass 2024",
    date: "Friday, March 22, 2024",
    time: "10:00 AM - 3:00 PM",
    location: "San Francisco, CA",
    attendeeCount: "250+",
    description: "Build scalable, consistent design systems from scratch to production",
    status: "upcoming",
    category: "Masterclass",
    speakers: [
      {
        name: "Diana Lee",
        title: "Design Systems Lead",
        company: "Figma",
        imageUrl: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdXglMjBkZXNpZ25lciUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MzM2OTM2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Ryan Cooper",
        title: "Senior Product Designer",
        company: "Airbnb",
        imageUrl: "https://images.unsplash.com/photo-1596078911728-0e407a3318d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGRlc2lnbmVyJTIwY3JlYXRpdmUlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzM2OTM2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    agenda: [
      {
        time: "10:00 AM - 10:30 AM",
        title: "Registration & Coffee",
        description: "Check-in and morning refreshments"
      },
      {
        time: "10:30 AM - 11:30 AM",
        title: "Design Systems Foundations",
        description: "Core principles and best practices"
      },
      {
        time: "11:45 AM - 1:00 PM",
        title: "Hands-on Workshop",
        description: "Build your first design system components"
      },
      {
        time: "1:00 PM - 1:45 PM",
        title: "Lunch Break",
        description: "Networking lunch provided"
      },
      {
        time: "1:45 PM - 3:00 PM",
        title: "Advanced Topics & Case Studies",
        description: "Learn from real-world design system implementations"
      }
    ]
  },
  "7": {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1642354984104-90e16a092c47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvJTIwY29uZmVyZW5jZSUyMHN0YWdlfGVufDF8fHx8MTc3MzM1OTI3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    organizer: "Web3 Builders Guild",
    title: "Blockchain & Decentralized Tech Expo",
    date: "Tuesday, April 2, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Miami, FL",
    attendeeCount: "600+",
    description: "Explore the future of decentralized technology, smart contracts, and Web3 infrastructure",
    status: "upcoming",
    category: "Expo",
    speakers: [
      { name: "Carlos Reyes", title: "Blockchain Architect", company: "Ethereum Foundation", imageUrl: "https://images.unsplash.com/photo-1646227655718-dd721b681d91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMG1hbiUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczMzY5MzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
      { name: "Priya Patel", title: "DeFi Protocol Lead", company: "Aave Labs", imageUrl: "https://images.unsplash.com/photo-1752952952773-80378cefc23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHRlY2glMjBzdGFydHVwJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMzY5MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" }
    ],
    agenda: [
      { time: "10:00 AM - 10:30 AM", title: "Registration & Welcome", description: "Badge pickup and networking" },
      { time: "10:30 AM - 11:30 AM", title: "Keynote: State of Web3", description: "Industry overview and trends" },
      { time: "11:45 AM - 12:45 PM", title: "Smart Contract Security Panel", description: "Best practices for secure blockchain development" },
      { time: "1:00 PM - 2:00 PM", title: "Lunch & Expo Floor", description: "Demo booths and networking" },
      { time: "2:15 PM - 3:30 PM", title: "DeFi Workshop", description: "Building decentralized finance protocols" },
      { time: "3:45 PM - 5:00 PM", title: "NFT & Digital Identity", description: "Beyond art: real-world blockchain applications" },
      { time: "5:00 PM - 6:00 PM", title: "Closing Mixer", description: "Networking drinks and wrap-up" }
    ]
  },
  "8": {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1761838897754-b5574cf222f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGdyZWVuJTIwdGVjaCUyMHN1bW1pdCUyMHBhbmVsfGVufDF8fHx8MTc3MzM1OTI3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    organizer: "GreenTech Alliance",
    title: "Sustainability & CleanTech Summit",
    date: "Wednesday, April 10, 2024",
    time: "9:00 AM - 4:00 PM",
    location: "Portland, OR",
    attendeeCount: "400+",
    description: "Driving innovation in clean energy, sustainable tech, and green infrastructure",
    status: "upcoming",
    category: "Summit",
    speakers: [
      { name: "Maya Johnson", title: "Sustainability Director", company: "Tesla Energy", imageUrl: "https://images.unsplash.com/photo-1601611900876-391151003440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwc3VzdGFpbmFiaWxpdHklMjBleGVjdXRpdmUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMzNjkzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
      { name: "Erik Lindstrom", title: "CleanTech Investor", company: "Breakthrough Energy", imageUrl: "https://images.unsplash.com/photo-1502457678009-64e473687045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtYW4lMjBpbnZlc3RvciUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzM2OTM2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" }
    ],
    agenda: [
      { time: "9:00 AM - 9:30 AM", title: "Welcome & Opening Remarks", description: "Setting the stage for sustainability" },
      { time: "9:30 AM - 10:30 AM", title: "Keynote: Climate Tech Innovation", description: "The next decade of green technology" },
      { time: "10:45 AM - 12:00 PM", title: "Clean Energy Panel", description: "Solar, wind, and emerging energy solutions" },
      { time: "12:00 PM - 1:00 PM", title: "Networking Lunch", description: "Farm-to-table catered lunch" },
      { time: "1:15 PM - 2:30 PM", title: "Circular Economy Workshop", description: "Designing products for sustainability" },
      { time: "2:45 PM - 4:00 PM", title: "Investor Showcase", description: "CleanTech startup pitches" }
    ]
  },
  "9": {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1639503547276-90230c4a4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwY29uZmVyZW5jZSUyMHNwZWFrZXJzfGVufDF8fHx8MTc3MzM1OTI3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    organizer: "CyberSec Forum",
    title: "Cybersecurity Defense Conference 2024",
    date: "Monday, April 15, 2024",
    time: "8:30 AM - 5:30 PM",
    location: "Washington, DC",
    attendeeCount: "800+",
    description: "Advanced cybersecurity strategies, threat intelligence, and defense frameworks",
    status: "upcoming",
    category: "Conference",
    speakers: [
      { name: "James Park", title: "CISO", company: "CrowdStrike", imageUrl: "https://images.unsplash.com/photo-1652148555073-4b1d2ecd664c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMGN5YmVyc2VjdXJpdHklMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzMzNjkzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
      { name: "Natasha Kowalski", title: "Threat Intelligence Lead", company: "Palo Alto Networks", imageUrl: "https://images.unsplash.com/photo-1615134012203-f52f20bb6637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXN0ZXJuJTIwZXVyb3BlYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMHRlY2glMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzMzNjkzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" }
    ],
    agenda: [
      { time: "8:30 AM - 9:00 AM", title: "Registration & Breakfast", description: "Check-in and morning refreshments" },
      { time: "9:00 AM - 10:00 AM", title: "Keynote: The Threat Landscape", description: "2024 cybersecurity challenges and trends" },
      { time: "10:15 AM - 11:15 AM", title: "Zero Trust Architecture", description: "Implementing zero trust in enterprise environments" },
      { time: "11:30 AM - 12:30 PM", title: "AI-Powered Threat Detection", description: "Machine learning in cybersecurity" },
      { time: "12:30 PM - 1:30 PM", title: "Lunch & Networking", description: "Connect with security professionals" },
      { time: "1:45 PM - 3:00 PM", title: "Incident Response Workshop", description: "Hands-on breach simulation exercise" },
      { time: "3:15 PM - 4:30 PM", title: "Cloud Security Panel", description: "Securing multi-cloud environments" },
      { time: "4:30 PM - 5:30 PM", title: "Closing & Awards", description: "CyberSec innovation awards ceremony" }
    ]
  }
};

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { addBlocks, registerForEvent, isEventRegistered } = useCalendarEvents();
  const { getStatus, toggleConnection } = useConnections();
  const [showRegistrationFlow, setShowRegistrationFlow] = useState(false);
  const [showMatchesSheet, setShowMatchesSheet] = useState(false);

  useScrollLock(showMatchesSheet);

  // Determine the back destination from navigation state, falling back to home
  const fromPath = (location.state as { from?: string })?.from || "/";
  const goBack = useGoBack(fromPath);

  // Get event data - in a real app, this would fetch from an API
  const event = id ? mockEvents[id] : mockEvents["1"];

  const isRegistered = event ? isEventRegistered(event.id) : false;

  const handleAddToCalendar = () => {
    setShowRegistrationFlow(true);
  };

  // Helper function to convert time format from "9:00 AM" to "09:00"
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.trim().split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  // Helper function to determine block kind based on title
  const getBlockKind = (title: string): BlockKind => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('keynote') || lowerTitle.includes('opening')) return 'speaker';
    if (lowerTitle.includes('panel') || lowerTitle.includes('q&a')) return 'panel';
    if (lowerTitle.includes('workshop') || lowerTitle.includes('hands-on')) return 'workshop';
    if (lowerTitle.includes('lunch') || lowerTitle.includes('break') || lowerTitle.includes('coffee') || lowerTitle.includes('networking')) return 'break';
    
    return 'workshop'; // default
  };

  const handleRegister = (data: RegistrationData) => {
    // In a real app, send registration data to backend
    console.log("Registration data:", data);
  };

  const handleConfirmAddToCalendar = () => {
    // Parse the event date string (e.g., "Monday, March 18, 2024") to YYYY-MM-DD
    const parsedDate = new Date(event.date.replace(/^\w+,\s*/, ""));
    const eventDateStr = !isNaN(parsedDate.getTime())
      ? `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`
      : undefined;

    // Convert agenda items to calendar blocks
    if (event.agenda && event.agenda.length > 0) {
      const calendarBlocks: CalendarBlockData[] = event.agenda.map((agendaItem, index) => {
        const [startTime, endTime] = agendaItem.time.split(' - ').map(convertTo24Hour);
        
        return {
          id: `event-${event.id}-agenda-${index}-${Date.now()}`,
          type: 'event' as const,
          kind: getBlockKind(agendaItem.title),
          title: agendaItem.title,
          date: eventDateStr,
          eventTitle: event.title,
          startTime,
          endTime,
          description: agendaItem.description
        };
      });
      
      addBlocks(calendarBlocks);
    }
    
    registerForEvent({
      id: `reg-${event.id}-${Date.now()}`,
      eventId: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      attendeeCount: event.attendeeCount,
      description: event.description,
      image: event.imageUrl,
      registeredAt: Date.now(),
    });
  };

  const handleCloseRegistration = () => {
    setShowRegistrationFlow(false);
  };

  const handleShare = () => {
    // In a real app, this would open a share sheet
    alert("Share functionality would open here");
  };

  const handleGoToCalendar = () => {
    // Parse the event date string (e.g., "Friday, July 5, 2024") to a Date
    const parsed = new Date(event.date.replace(/^\w+,\s*/, ""));
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    navigate(`/calendar?date=${year}-${month}-${day}`);
  };

  // Find recommended people attending this event
  const matchesAttending = useMemo(() => {
    if (!event) return [];
    return recommendedPeople.filter(
      (p) => p.eventsAttending && p.eventsAttending.includes(event.title)
    );
  }, [event]);

  const navigatingRef = useRef(false);
  const handleNavigateToProfile = useCallback((personId: string) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setShowMatchesSheet(false);
    navigate(`/profile/${personId}`, { state: { from: location.pathname } });
    setTimeout(() => { navigatingRef.current = false; }, 500);
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-white font-['Open_Sans',sans-serif] pb-24">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0]">
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => goBack()}
            className="p-2 -ml-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#0D1117]" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 -mr-2 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-[#0D1117]" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        {event.status === "upcoming" && (
          <div className="absolute top-4 right-4">
            <span className="px-4 py-2 bg-[#2E9BF5] text-white rounded-full text-sm font-['Open_Sans',sans-serif] font-semibold">
              Upcoming
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="px-4 py-6">
        {/* Title */}
        <h1 className="font-['Rethink_Sans',sans-serif] text-3xl font-bold text-[#0D1117] mb-4">
          {event.title}
        </h1>

        {/* Key Details */}
        <div className="space-y-3 mb-6">
          {/* Attendees */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E0F2FF] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-[#2E9BF5]" />
            </div>
            <div>
              <p className="text-sm text-[#718096] font-['Open_Sans',sans-serif] text-xs uppercase tracking-wide">
                Total Attendees
              </p>
              <p className="font-['Rethink_Sans',sans-serif] text-lg font-bold text-[#0D1117]">
                {event.attendeeCount}
              </p>
            </div>
          </div>

          {/* Matches Attending */}
          {matchesAttending.length > 0 && (
            <button
              onClick={() => setShowMatchesSheet(true)}
              className="flex items-center gap-3 w-full text-left group active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[#0A7CFF]/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#0A7CFF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#718096] font-['Open_Sans',sans-serif] text-xs uppercase tracking-wide">
                  Your Matches Attending
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {matchesAttending.slice(0, 3).map((p) => (
                      <img
                        key={p.id}
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-[#0A7CFF]">
                    {matchesAttending.length} {matchesAttending.length === 1 ? "match" : "matches"} going
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#0D1117] flex-shrink-0 transition-transform" />
            </button>
          )}

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E0F2FF] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#2E9BF5]" />
            </div>
            <div>
              <p className="text-sm text-[#718096] font-['Open_Sans',sans-serif] text-xs uppercase tracking-wide">
                Date
              </p>
              <p className="font-['Rethink_Sans',sans-serif] text-lg font-bold text-[#0D1117]">
                {event.date}
              </p>
              <p className="font-['Rethink_Sans',sans-serif] text-sm text-[#718096]">
                {event.time}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E0F2FF] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#2E9BF5]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#0D1117]">
                {event.location}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-3">About This Event</h2>
          <p className="text-[#4A5568] leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-6">
            <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-4">Featured Speakers</h2>
            <div className="space-y-3">
              {event.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-[#F7F8FA] rounded-xl border border-[#E2E8F0]"
                >
                  <img
                    src={speaker.imageUrl}
                    alt={speaker.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0D1117]">{speaker.name}</h3>
                    <p className="text-sm text-[#4A5568]">{speaker.title}</p>
                    <p className="text-xs text-[#718096]">{speaker.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda */}
        {event.agenda && event.agenda.length > 0 && (
          <div className="mb-6">
            <h2 className="font-['Rethink_Sans',sans-serif] text-xl font-bold text-[#0D1117] mb-4">Event Agenda</h2>
            <div className="space-y-4">
              {event.agenda.map((item, index) => (
                <div key={index} className="relative pl-6 pb-4 last:pb-0">
                  <div className="absolute left-0 top-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#2E9BF5] border-2 border-white ring-2 ring-[#2E9BF5]/20" />
                    {index !== event.agenda!.length - 1 && (
                      <div className="absolute left-1/2 top-3 w-0.5 h-full bg-[#2E9BF5]/20 -translate-x-1/2" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-['Rethink_Sans',sans-serif] font-semibold text-[#0A7CFF] uppercase tracking-wide mb-1">
                      {item.time}
                    </p>
                    <h3 className="font-bold text-[#0D1117] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#4A5568]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organizer Info */}
        <div className="mb-6 p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-xs font-['Open_Sans',sans-serif] text-[#718096] uppercase tracking-wide mb-1">
            Organized By
          </p>
          <p className="font-bold text-[#0D1117]">{event.organizer}</p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-4 py-4 z-20">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCalendar}
            disabled={isRegistered}
            className={`flex-1 py-4 rounded-xl font-['Open_Sans',sans-serif] font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              isRegistered
                ? "bg-[#E0F2FF] text-[#0A7CFF] cursor-default"
                : "bg-[#0A7CFF] text-white active:scale-[0.98]"
            }`}
          >
            {isRegistered ? (
              <>
                <Check className="w-6 h-6" />
                Registered
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </div>

      {/* Registration Flow */}
      {showRegistrationFlow && (
        <EventRegistrationFlow
          eventTitle={event.title}
          eventDate={event.date}
          eventTime={event.time}
          onClose={handleCloseRegistration}
          onRegister={handleRegister}
          onAddToCalendar={handleConfirmAddToCalendar}
          onGoToCalendar={handleGoToCalendar}
        />
      )}

      {/* Matches Attending Bottom Sheet */}
      {showMatchesSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMatchesSheet(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 flex items-center justify-between flex-shrink-0 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-['Rethink_Sans',sans-serif] text-lg font-semibold text-[#0D1117]">
                  Matches Attending
                </h3>
                <p className="font-['Open_Sans',sans-serif] text-sm text-[#718096]">
                  {matchesAttending.length} people you should meet at this event
                </p>
              </div>
              <button
                onClick={() => setShowMatchesSheet(false)}
                className="p-2 rounded-lg transition-colors -mr-2"
              >
                <X className="w-5 h-5 text-[#0D1117]" />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto flex-1 px-5 py-4 scrollbar-hide">
              <div className="space-y-3">
                {matchesAttending.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-2 w-full p-3.5 bg-[#F7F8FA] rounded-xl"
                  >
                    <button
                      onClick={() => handleNavigateToProfile(person.id)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    </button>
                    <button
                      onClick={() => handleNavigateToProfile(person.id)}
                      className="flex-1 min-w-0 text-left self-stretch flex flex-col justify-center"
                    >
                      <h4 className="font-['Open_Sans',sans-serif] font-bold text-[#0D1117] truncate">
                        {person.name}
                      </h4>
                      <p className="font-['Open_Sans',sans-serif] text-sm text-[#4A5568] truncate">
                        {person.title}
                      </p>
                      <p className="font-['Open_Sans',sans-serif] text-xs text-[#718096] truncate">
                        {person.company}
                      </p>
                    </button>
                    <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 py-0.5">
                      <span className="bg-[#2E9BF5] rounded-full px-2.5 py-1 flex items-center justify-center">
                        <span className="font-['Rethink_Sans',sans-serif] font-semibold text-[11px] text-white leading-none">
                          {person.matchPercentage}%
                        </span>
                      </span>
                      <MatchConnectButton personId={person.id} getStatus={getStatus} toggleConnection={toggleConnection} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}