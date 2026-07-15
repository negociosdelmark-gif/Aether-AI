import { StrategyData } from "./types";

export const DEFAULT_STRATEGY: StrategyData = {
  businessName: "Aether AI",
  businessType: "Agencia de Inteligencia Estratégica",
  roadmap: {
    phase1: {
      name: "Neural Alignment",
      days: "DAYS 1-10",
      tasks: [
        "Audit existing assets & brand voice.",
        "Define AI training parameters for content.",
        "Initial competitive matrix synthesis."
      ],
      kpiName: "CONTENT FIDELITY",
      kpiValue: 85
    },
    phase2: {
      name: "Content Prototyping",
      days: "DAYS 11-20",
      tasks: [
        "Generate 30-day social content batch.",
        "Launch SEM 'Ghost' campaigns for data.",
        "A/B Testing Landing Page vectors."
      ],
      kpiName: "REACH POTENTIAL",
      kpiValue: 40
    },
    phase3: {
      name: "Global Activation",
      days: "DAYS 21-30",
      tasks: [
        "Scale high-performing ad sets.",
        "Automation of customer acquisition funnel.",
        "Performance reporting dashboard live."
      ],
      kpiName: "CONVERSION VELOCITY",
      kpiValue: 12
    }
  },
  seoClusters: [
    { name: "Generative CX", growth: "+142%" },
    { name: "Agentic Workflows", growth: "+88%" },
    { name: "Neural Search", growth: "+64%" }
  ],
  budgetEfficiency: [
    { label: "Neural Auditing", height: 60 },
    { label: "Content Batching", height: 85 },
    { label: "Ghost Campaigns", height: 100 },
    { label: "A/B Testing", height: 75 },
    { label: "Funnel Automations", height: 40 }
  ],
  aiAutomations: [
    { name: "LeadSift Agent", status: "Active: 24/7 Prospecting", filledIcon: true },
    { name: "Sales Oracle v2", status: "Standby: Deployment Ready", filledIcon: false }
  ],
  socialContent: [
    {
      platform: "TikTok: \"The Agent Gap\"",
      subtitle: "Viral Hook: Problem/Agitate/Solve",
      hook: "Focus in on industry bottlenecks",
      schedule: "3 posts per week",
      reach: "94% EST. REACH"
    },
    {
      platform: "LinkedIn: AI Governance",
      subtitle: "Thought Leadership Series",
      hook: "How trust scales digital operations",
      schedule: "TUE 09:00",
      reach: "Avg Engagement 12.8%"
    }
  ],
  seoMetrics: {
    brandTone: 78,
    localSearch: 92
  },
  competitors: [
    {
      name: "Lumina Analytics",
      marketCapture: 45,
      rating: 2,
      statusText: "HIGH VOLATILITY",
      statusColor: "green"
    },
    {
      name: "Nexus Core",
      marketCapture: 72,
      rating: 3,
      statusText: "STABLE RIVAL",
      statusColor: "yellow"
    }
  ],
  visualDna: {
    aesthetic: "CYBER-MINIMALIST AESTHETIC",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAW6rtAKl38_9h4vuDcr6_InWpSQ1zAYX_JUs20ezQW8N23pyyCoZRgjERwwHKD6QEeQ7BIfYXZzhjt_5rQPy4onVS4iJNo2Y894p-MlmfY4vwsODzcnIl4JMzE4eX_nZKQEMt_sQJYTP_W1g6vocRXAbvGOy5uGusoeeJgoynGX0JsohE8xtVanGbS7I577MGZckaPBBTq8WjDRHc_l3qOiWgJnypSYz40_ho9i4Vm241mZoYYTpdsNY6OY2AkdKbPJjlc5_OQs3M",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbvtde-RUwIIy6bxK64RJ5fjXYDOnJB1ggstwkvhfxxJ2iee0VkXj8L5UBi_A217hdRMxQxBXttEIoJ0RsaXq050W2HzAhqF6GeEJAinJuP0nXJc-UEPtjae9pYOmHdfYh5VDhAaxTuoBPCtBNLo5MVciB0XgOlTvC5cM7yovMH8sqgObRG_E6SsbgFSgLn4XwRnsQ4FUnIbUsWkQukqkkLVBXlxZ0JC4Ka6Kh5d53lE9wIYtIPN9giGg2XeSjkJO_gE54g3-yCZg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIz-776l3C9C-MTlZ27rnJxsGVbQW0vT0He4KaxZSNwYzA0ihlzfjt2paBzY7WHsb7sVcaCjWZRrYygN0Xi3JPEZduOk0fKKLlGOc0c1tyg5_F5PtvneXfAYxahpRuE6cTe4UHjeaXUgIJYIDrhfuwRJWpgUBrdD5qVSupoQDaVxMQ9kaUkNDRbwyCLjsG5XFVyjia0bx7nHAL-5nHzW4hbdHtIT691UF3GC3n-D4F1hg7AhIca82T8tRoTOJEYdMZ8EANbUvkuCo",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXAdjMpFtm7_DSwSyzI60pJMKh4Irl2qt4IMXDLbSyTa_e1feNsr-LW9LkSKUzTPtp0F_WQv539kAL4LMjGxwvhEZfbljXYihufHAiFCfrjwcd5EwtOzmW8Mz_ps9O46cX-sD_rnk-0achGSsP41T3y3k4Gu-OI5-UVbvbY58UeAW41FevEMduWXxbfY7WaPA_wsCivSRiB7UXRZSV-pVmP69zwvoCgVGdNXRpFJCuili1dF8NdXLJwDEryscTnlosimCVQaTZiHQ"
    ],
    chromatic: [
      { role: "PRIMARY", name: "Electric Cyan", hex: "#00f0ff" },
      { role: "BASE", name: "Deep Obsidian", hex: "#0A0A0B" },
      { role: "NEUTRAL", name: "Ghost Steel", hex: "#b9cacb" }
    ]
  }
};
