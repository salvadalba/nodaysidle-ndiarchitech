/**
 * Project Roulette - Random Startup Idea Generator
 */

// Domains/Industries
const DOMAINS = [
    "FinTech",
    "HealthTech",
    "EdTech",
    "PropTech",
    "FoodTech",
    "CleanTech",
    "Gaming",
    "Social Media",
    "E-commerce",
    "Logistics",
    "HR Tech",
    "Legal Tech",
    "InsurTech",
    "AgriTech",
    "Travel Tech",
    "Mental Health",
    "Fitness",
    "Pet Care",
    "Music",
    "Art & Creativity"
]

// Business Patterns
const PATTERNS = [
    "An AI-powered platform for",
    "A marketplace connecting",
    "A subscription service for",
    "A mobile-first solution for",
    "A gamified experience for",
    "An automation tool for",
    "A community platform for",
    "A personalized recommendation engine for",
    "A no-code builder for",
    "A real-time collaboration tool for"
]

// Target Audiences
const AUDIENCES = [
    "busy professionals",
    "remote workers",
    "small business owners",
    "Gen Z consumers",
    "parents with young children",
    "senior citizens",
    "college students",
    "freelancers and creators",
    "fitness enthusiasts",
    "eco-conscious consumers"
]

// Unique Twists
const TWISTS = [
    "Uses blockchain for transparency and trust.",
    "Leverages AR/VR for immersive experiences.",
    "Features AI assistants that learn user preferences.",
    "Includes social features for community building.",
    "Offers a freemium model with premium insights.",
    "Integrates with popular tools like Slack, Notion, and Calendar.",
    "Provides real-time analytics and dashboards.",
    "Uses gamification to boost engagement.",
    "Focuses on privacy-first, zero-data-collection.",
    "Supports multiple languages for global reach."
]

// Tech Stack Suggestions
const TECH_STACKS = [
    "modern-web",
    "mobile-native",
    "saas-platform",
    "ai-ml-platform",
    "realtime-collab"
]

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function pickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

export interface RouletteIdea {
    description: string
    suggestedStack: string
}

export function generateRandomIdea(): RouletteIdea {
    const domain = pick(DOMAINS)
    const pattern = pick(PATTERNS)
    const audience = pick(AUDIENCES)
    const twists = pickMultiple(TWISTS, 2)

    const description = `${pattern} ${domain.toLowerCase()} targeting ${audience}.

Key Features:
- ${twists[0]}
- ${twists[1]}
- Mobile and web support with offline capabilities.
- Clean, modern UI with dark mode support.

The goal is to create a seamless experience that solves real pain points for ${audience} in the ${domain} space.`

    return {
        description,
        suggestedStack: pick(TECH_STACKS)
    }
}

// Fun idea name generator
const PREFIXES = ["Nova", "Pulse", "Nexus", "Flux", "Orbit", "Spark", "Wave", "Sync", "Zen", "Flow"]
const SUFFIXES = ["ify", "ly", "io", "hub", "lab", "base", "space", "works", "mind", "core"]

export function generateAppName(): string {
    return pick(PREFIXES) + pick(SUFFIXES)
}
