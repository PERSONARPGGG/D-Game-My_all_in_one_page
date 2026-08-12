export type CategorySlug = 
  | 'ai-dev' 
  | 'backend-infra' 
  | 'frontend' 
  | 'dev-workflow' 
  | 'startup-revenue' 
  | 'us-stocks-etf' 
  | 'macro-fed' 
  | 'real-estate' 
  | 'game-playing' 
  | 'game-official' 
  | 'news-breaking' 
  | 'trends';

export type CategoryGroup = 'dev-ai' | 'invest' | 'game' | 'news';

export interface Category {
  slug: CategorySlug;
  label: string;
  group: CategoryGroup;
  icon: string;
  color: string;
  displayOrder: number;
  description?: string;
  keywords?: string[];
}

export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'scraper' | 'reddit' | 'dcinside' | 'official';
  url: string;
  config?: Record<string, unknown>;
  categorySlug: CategorySlug;
  isActive: boolean;
  fetchIntervalMinutes: number;
  lastFetchedAt?: string;
  errorCount: number;
  priority: number;
}

export interface Article {
  id: string;
  sourceId: string;
  categorySlug: CategorySlug;
  title: string;
  url: string;
  summary?: string;
  content?: string;
  thumbnail?: string;
  author?: string;
  publishedAt: string;
  fetchedAt: string;
  aiSummary?: string;
  aiTags?: string[];
  aiActions?: string[];
  aiImportance: 1 | 2 | 3 | 4 | 5;
  aiCategorySlug?: CategorySlug;
  rawData?: Record<string, unknown>;
  isBreaking: boolean;
  isRead: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  activeCategories: CategorySlug[];
  keywords: Array<{ word: string; include: boolean; categorySlug?: CategorySlug }>;
  briefingTimeMorning: string;
  briefingTimeEvening: string;
  notificationSettings: {
    breaking: boolean;
    daily: boolean;
    keywords: boolean;
    gamePatch: boolean;
    gameEvent: boolean;
    gameCoupon: boolean;
  };
  theme: 'light' | 'dark' | 'amoled' | 'system';
  tone: 'manager' | 'brother' | 'senior' | 'entj';
  viewMode: 'mobile' | 'desktop';
  createdAt: string;
  updatedAt: string;
}

export interface Highlight {
  id: string;
  userId: string;
  articleId: string;
  text: string;
  note?: string;
  tags: string[];
  location?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  id: string;
  userId: string;
  articleId?: string;
  title: string;
  description?: string;
  status: 'pending' | 'doing' | 'done' | 'archived';
  dueDate?: string;
  completedAt?: string;
  streakCount: number;
  categorySlug?: CategorySlug;
  createdAt: string;
  updatedAt: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  date: string;
  briefingContent: Record<string, unknown>;
  articlesViewed: number;
  actionsCompleted: number;
  readingTimeMinutes: number;
  createdAt: string;
}

export interface GameInfo {
  gameId: string;
  name: string;
  displayName?: string;
  platform: 'steam' | 'mobile' | 'console' | 'web' | 'pc';
  coverImage?: string;
  officialUrl?: string;
  communityUrls: string[];
  dcinsideIds: string[];
  redditSubs: string[];
  isActive: boolean;
  notifyPatch: boolean;
  notifyEvent: boolean;
  notifyCoupon: boolean;
  notifyServer: boolean;
  customKeywords: string[];
}

export interface GamePatch {
  id: string;
  gameId: string;
  version: string;
  title?: string;
  content?: string;
  url?: string;
  publishedAt?: string;
  fetchedAt: string;
  rawData?: Record<string, unknown>;
}

export interface GameEvent {
  id: string;
  gameId: string;
  title: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  rewards?: unknown[];
  conditions?: string;
  url?: string;
  eventType: 'event' | 'maintenance' | 'update' | 'coupon';
  isActive: boolean;
  createdAt: string;
}

export interface GameCoupon {
  id: string;
  gameId: string;
  code: string;
  rewards?: unknown[];
  expiresAt?: string;
  url?: string;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface PortfolioHolding {
  id: string;
  userId: string;
  ticker: string;
  name?: string;
  quantity: number;
  avgPrice?: number;
  currentPrice?: number;
  currency: string;
  assetType: 'stock' | 'etf' | 'crypto' | 'reit' | 'cash';
  sector?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioTransaction {
  id: string;
  userId: string;
  holdingId: string;
  type: 'buy' | 'sell' | 'dividend' | 'split' | 'transfer_in' | 'transfer_out';
  quantity: number;
  price: number;
  fee: number;
  tax: number;
  executedAt: string;
  note?: string;
  createdAt: string;
}

export interface PortfolioAlert {
  id: string;
  userId: string;
  ticker: string;
  alertType: 'price_above' | 'price_below' | 'trailing_stop' | 'earnings' | 'dividend' | 'news';
  condition: Record<string, unknown>;
  isActive: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export type Theme = 'light' | 'dark' | 'amoled' | 'system';
export type Tone = 'manager' | 'brother' | 'senior' | 'entj';
export type ViewMode = 'mobile' | 'desktop';
export type ArticleSort = 'latest' | 'importance' | 'unread';
export type ArticleView = 'card' | 'compact';