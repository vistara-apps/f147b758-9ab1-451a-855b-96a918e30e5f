// User Data Model
export interface User {
  fid: string;
  walletAddress: string;
  creditsRemaining: number;
  tierType: 'free' | 'premium';
  savedMemes: string[];
  connectedAccounts: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences: {
    niches: string[];
    notificationSettings: boolean;
  };
}

// Meme Data Model
export interface Meme {
  memeId: string;
  imageUrl: string;
  sourceUrl: string;
  platform: 'reddit' | 'twitter' | 'tiktok';
  viralityScore: number;
  trendingTimeWindow: '1h' | '3h' | '6h';
  category: 'crypto' | 'startup' | 'fitness' | 'genz' | 'dating';
  captionSuggestions: string[];
  engagementVelocity: number;
  discoveredAt: string;
}

// Meme Collection Data Model
export interface MemeCollection {
  collectionId: string;
  name: string;
  niche: string;
  memeIds: string[];
  priceUsdc: number;
  updatedAt: string;
}

// Analytics Event Data Model
export interface AnalyticsEvent {
  eventId: string;
  userId: string;
  memeId: string;
  platform: string;
  likes: number;
  shares: number;
  comments: number;
  postedAt: string;
}

// UI State Types
export type TimeWindow = '1h' | '3h' | '6h';
export type Category = 'all' | 'crypto' | 'startup' | 'fitness' | 'genz' | 'dating';
