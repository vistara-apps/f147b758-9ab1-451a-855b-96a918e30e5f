import { Meme, MemeCollection } from './types';

export const mockMemes: Meme[] = [
  {
    memeId: '1',
    imageUrl: 'https://i.redd.it/sample1.jpg',
    sourceUrl: 'https://reddit.com/r/memes/sample1',
    platform: 'reddit',
    viralityScore: 95,
    trendingTimeWindow: '1h',
    category: 'crypto',
    captionSuggestions: [
      'When you check your portfolio at 3am 📈',
      'HODL gang rise up 💎🙌',
      'This is the way'
    ],
    engagementVelocity: 1250,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '2',
    imageUrl: 'https://i.redd.it/sample2.jpg',
    sourceUrl: 'https://reddit.com/r/memes/sample2',
    platform: 'twitter',
    viralityScore: 88,
    trendingTimeWindow: '3h',
    category: 'genz',
    captionSuggestions: [
      'POV: You just discovered a new hyperfixation',
      'No thoughts, just vibes',
      'It be like that sometimes'
    ],
    engagementVelocity: 890,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '3',
    imageUrl: 'https://i.redd.it/sample3.jpg',
    sourceUrl: 'https://reddit.com/r/memes/sample3',
    platform: 'reddit',
    viralityScore: 92,
    trendingTimeWindow: '1h',
    category: 'startup',
    captionSuggestions: [
      'Startup founders explaining their MVP',
      'We\'re disrupting the industry',
      'Just shipped a new feature 🚀'
    ],
    engagementVelocity: 1100,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '4',
    imageUrl: 'https://i.redd.it/sample4.jpg',
    sourceUrl: 'https://reddit.com/r/memes/sample4',
    platform: 'tiktok',
    viralityScore: 85,
    trendingTimeWindow: '6h',
    category: 'fitness',
    captionSuggestions: [
      'Leg day hits different',
      'One more rep bro',
      'Gym motivation 💪'
    ],
    engagementVelocity: 750,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '5',
    imageUrl: 'https://i.redd.it/sample5.jpg',
    sourceUrl: 'https://reddit.com/r/memes/sample5',
    platform: 'twitter',
    viralityScore: 90,
    trendingTimeWindow: '3h',
    category: 'dating',
    captionSuggestions: [
      'Dating in 2024 be like',
      'Red flags? I only see opportunities',
      'Love is a social construct'
    ],
    engagementVelocity: 980,
    discoveredAt: new Date().toISOString(),
  },
  {
    memeId: '6',
    imageUrl: 'https://i.redd.it/sample6.jpg',
    sourceUrl: 'https://reddit.com/r/memes/sample6',
    platform: 'reddit',
    viralityScore: 87,
    trendingTimeWindow: '1h',
    category: 'crypto',
    captionSuggestions: [
      'Wen moon? 🌙',
      'Buy the dip they said',
      'Not financial advice'
    ],
    engagementVelocity: 820,
    discoveredAt: new Date().toISOString(),
  },
];

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
    name: 'Gen Z Humor Pack',
    niche: 'genz',
    memeIds: ['2'],
    priceUsdc: 10,
    updatedAt: new Date().toISOString(),
  },
];
