import type { Meme, MemeCollection, User } from './types';

// Mock trending memes data
export const mockMemes: Meme[] = [
  {
    memeId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=400&fit=crop',
    sourceUrl: 'https://reddit.com/r/memes',
    platform: 'reddit',
    viralityScore: 95,
    trendingTimeWindow: '1h',
    category: 'crypto',
    captionSuggestions: [
      'When you check your portfolio at 3am 📈',
      'HODL gang rise up 💎🙌',
      'This is the way 🚀'
    ],
    engagementVelocity: 1250,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&h=400&fit=crop',
    sourceUrl: 'https://twitter.com/memes',
    platform: 'twitter',
    viralityScore: 88,
    trendingTimeWindow: '1h',
    category: 'genz',
    captionSuggestions: [
      'POV: You just discovered a new hyperfixation',
      'No thoughts, just vibes ✨',
      'Main character energy 💅'
    ],
    engagementVelocity: 980,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop',
    sourceUrl: 'https://reddit.com/r/startups',
    platform: 'reddit',
    viralityScore: 82,
    trendingTimeWindow: '3h',
    category: 'startup',
    captionSuggestions: [
      'Startup founders at 2am debugging production',
      'When the MVP actually works 🎉',
      'Pivot szn incoming 📊'
    ],
    engagementVelocity: 750,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '4',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    sourceUrl: 'https://tiktok.com/@fitness',
    platform: 'tiktok',
    viralityScore: 76,
    trendingTimeWindow: '3h',
    category: 'fitness',
    captionSuggestions: [
      'Leg day hits different 💪',
      'When you finally see gains 📈',
      'Gym bros be like...'
    ],
    engagementVelocity: 620,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
    sourceUrl: 'https://reddit.com/r/dating',
    platform: 'reddit',
    viralityScore: 71,
    trendingTimeWindow: '6h',
    category: 'dating',
    captionSuggestions: [
      'Dating in 2024 be like...',
      'When they text back after 3 days 📱',
      'Red flags? I only see opportunities 🚩'
    ],
    engagementVelocity: 450,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '6',
    imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400&h=400&fit=crop',
    sourceUrl: 'https://twitter.com/cryptomemes',
    platform: 'twitter',
    viralityScore: 68,
    trendingTimeWindow: '6h',
    category: 'crypto',
    captionSuggestions: [
      'Wen moon? 🌙',
      'Not financial advice but... 👀',
      'WAGMI fam 🤝'
    ],
    engagementVelocity: 380,
    discoveredAt: new Date().toISOString(),
  },
];

// Mock meme collections
export const mockCollections: MemeCollection[] = [
  {
    collectionId: 'crypto-pack',
    name: 'Crypto Memes Pack',
    niche: 'crypto',
    memeIds: ['1', '6'],
    priceUsdc: 10,
    updatedAt: new Date().toISOString(),
  },
  {
    collectionId: 'startup-pack',
    name: 'Startup Memes Pack',
    niche: 'startup',
    memeIds: ['3'],
    priceUsdc: 10,
    updatedAt: new Date().toISOString(),
  },
  {
    collectionId: 'genz-pack',
    name: 'Gen Z Memes Pack',
    niche: 'genz',
    memeIds: ['2'],
    priceUsdc: 10,
    updatedAt: new Date().toISOString(),
  },
];

// Mock user data
export const mockUser: User = {
  fid: 'demo-user',
  walletAddress: '0x1234...5678',
  creditsRemaining: 5,
  tierType: 'free',
  savedMemes: [],
  connectedAccounts: {},
  preferences: {
    niches: ['crypto', 'startup'],
    notificationSettings: true,
  },
};
