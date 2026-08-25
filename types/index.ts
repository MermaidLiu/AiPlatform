export type Category = 'office' | 'comic' | 'ecommerce';

export type OwnedGroup = 'enterprise' | 'office' | 'comic' | 'ecommerce';

export type Difficulty = '入门' | '进阶' | '专业';

export type VerificationStatus = 'verified' | 'pending';

export interface ToolComparison {
  vsTool: string;
  advantage: string;
}

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: Category[];
  ownedGroup?: OwnedGroup;
  scenarios: string[];
  howToUse: string;
  pricing: string;
  difficulty: Difficulty;
  faq: ToolFAQ[];
  tutorialUrl?: string;
  productUrl: string;
  isFree: boolean;
  hasChinese: boolean;
  hasTutorial: boolean;
  mobileReady: boolean;
  owned: boolean;
  ownedDesc?: string;
  agencyDiscount: boolean;
  agencyDesc?: string;
  boostWeight: number;
  fullOwnedFlow?: boolean;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  comparison?: ToolComparison[];
  ageRestricted?: boolean;
}

export interface FlowStep {
  stepNumber: number;
  title: string;
  description: string;
  candidateTools: string[];
  handoffNote?: string;
}

export interface Flow {
  id: string;
  title: string;
  category: Category;
  scenario: string;
  description: string;
  steps: FlowStep[];
  fullOwnedFlow: boolean;
  estimatedCost: string;
  difficulty: Difficulty;
  tags: string[];
  createdAt: string;
  viewCount: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: string;
  scenarios: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  url?: string;
}

export interface FilterOptions {
  free?: boolean;
  chinese?: boolean;
  tutorial?: boolean;
  mobile?: boolean;
  agencyDiscount?: boolean;
  prioritizeOwned?: boolean;
  category?: Category;
  scenario?: string;
  query?: string;
}

export interface AdminConfig {
  ownedSectionEnabled: boolean;
  categoryGrayScale: Record<Category, boolean>;
  ownedToolIds: string[];
  boostWeights: Record<string, number>;
}
