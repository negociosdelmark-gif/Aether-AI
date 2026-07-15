/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Phase {
  name: string;
  days: string;
  tasks: string[];
  kpiName: string;
  kpiValue: number;
}

export interface SeoCluster {
  name: string;
  growth: string;
}

export interface BudgetEfficiency {
  label: string;
  height: number; // percentage (0-100)
}

export interface AiAutomation {
  name: string;
  status: string;
  filledIcon: boolean;
}

export interface SocialMediaItem {
  platform: string;
  subtitle: string;
  hook: string;
  schedule: string;
  reach: string;
}

export interface Competitor {
  name: string;
  marketCapture: number; // percentage (0-100)
  rating: number; // 1-5 star rating
  statusText: string;
  statusColor: "green" | "yellow" | "red";
}

export interface StrategyData {
  businessName: string;
  businessType: string;
  roadmap: {
    phase1: Phase;
    phase2: Phase;
    phase3: Phase;
  };
  seoClusters: SeoCluster[];
  budgetEfficiency: BudgetEfficiency[];
  aiAutomations: AiAutomation[];
  socialContent: SocialMediaItem[];
  seoMetrics: {
    brandTone: number;
    localSearch: number;
  };
  competitors: Competitor[];
  visualDna: {
    images: string[];
    aesthetic: string;
    chromatic: Array<{
      role: string;
      name: string;
      hex: string;
    }>;
  };
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export interface PhaseNote {
  id: string;
  text: string;
  createdAt: string;
  isMilestone?: boolean;
}

export interface BrandSettings {
  industry: string;
  targetAudience: string;
  toneOfVoice: string;
}

