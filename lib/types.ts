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
    notificationSettings: {
      viralAlerts: boolean;
      newPacks: boolean;
      lowCredits: boolean;
    };
  };
}

export interface Meme {
  memeId: string;
  imageUrl: string;
  sourceUrl: string;
  platform: 'reddit' | 'twitter' | 'tiktok';
  viralityScore: number;
  trendingTimeWindow: '1h' | '3h' | '6h';
  category: string;
  captionSuggestions: string[];
  engagementVelocity: number;
  discoveredAt: string;
}

export interface MemeCollection {
  collectionId: string;
  name: string;
  niche: string;
  memeIds: string[];
  priceUsdc: number;
  updatedAt: string;
}

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

export interface FrameAction {
  action: string;
  label: string;
  variant: 'primary' | 'secondary' | 'ghost';
  handler: () => void;
}

export interface Notification {
  id: string;
  type: 'viral_meme' | 'new_pack' | 'low_credits';
  title: string;
  message: string;
  actionUrl?: string;
  timestamp: string;
}

