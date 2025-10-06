# MemeFlow - Base MiniApp

Catch viral memes before they peak with real-time trending content, one-tap social posting, and engagement analytics.

## Features

- 🔥 Real-time meme feed with virality scores
- 📊 Analytics dashboard for performance tracking
- 💎 Premium niche meme collections
- 🚀 One-tap posting to Farcaster, Twitter, LinkedIn
- 💰 Base-powered micro-transactions
- 📱 Mobile-first responsive design
- 🤖 AI-powered caption generation
- 📈 Performance analytics and insights

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **Database**: Upstash Redis
- **APIs**: Reddit, Twitter, Giphy, Farcaster, OpenAI
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **Wallet**: Coinbase Wallet integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Coinbase Developer Platform account
- Upstash Redis account
- API keys for external services (optional but recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd memeflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:

### Required Environment Variables

```env
# OnchainKit (get from https://portal.cdp.coinbase.com/)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# Upstash Redis (required for data storage)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Farcaster (required for posting)
FARCASTER_HUB_URL=https://hub.pinata.cloud
NEYNAR_API_KEY=your_neynar_api_key
FARCASTER_SIGNER_UUID=your_farcaster_signer_uuid

# App configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Environment Variables

```env
# Reddit API (for enhanced meme sourcing)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret

# Twitter API (for enhanced meme sourcing)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Giphy API (for animated content)
GIPHY_API_KEY=your_giphy_api_key

# OpenAI API (for AI caption generation)
OPENAI_API_KEY=your_openai_api_key

# USDC payments
USDC_RECIPIENT_ADDRESS=your_usdc_recipient_address
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/                    # API routes
│   ├── analytics/         # Analytics endpoints
│   ├── collections/       # Collection management
│   ├── frame/            # Farcaster frame actions
│   ├── memes/            # Meme operations
│   └── users/            # User management
├── analytics/            # Analytics dashboard page
├── collections/          # Collections page
├── profile/              # User profile page
├── layout.tsx            # Root layout
├── page.tsx              # Main feed page
├── providers.tsx         # App providers
└── globals.css           # Global styles

components/
├── AnalyticsChart.tsx    # Analytics visualization
├── BottomNav.tsx         # Mobile navigation
├── CollectionCard.tsx    # Collection display
├── FeedShell.tsx         # Feed container
├── Header.tsx            # App header
├── InfiniteFeed.tsx      # Infinite scroll feed
├── LoadingSpinner.tsx    # Loading indicator
├── MemeCard.tsx          # Meme display card
├── MiniKitProvider.tsx   # MiniKit context
├── PaymentModal.tsx      # Payment interface
├── PostingModal.tsx      # Social posting interface
├── StatsCard.tsx         # Statistics display
├── TimeFilter.tsx        # Time filter controls
├── UserProfile.tsx       # User profile component
└── ui/                  # Reusable UI components

lib/
├── database.ts          # Database operations
├── minikit.ts           # MiniKit integration
├── redis.ts             # Redis client
├── services/            # External API services
│   ├── farcaster.ts     # Farcaster integration
│   ├── giphy.ts         # Giphy API
│   ├── meme-fetcher.ts  # Meme aggregation
│   ├── notifications.ts # Notification system
│   ├── openai.ts        # OpenAI integration
│   ├── reddit.ts        # Reddit API
│   └── twitter.ts       # Twitter API
├── types.ts             # TypeScript definitions
└── utils.ts            # Utility functions
```

## Key Features Implementation

### Real-Time Meme Feed
- Aggregates trending memes from Reddit, Twitter, and Giphy
- Calculates virality scores based on engagement velocity
- Time window filters (1h, 3h, 6h)
- Infinite scroll with lazy loading
- Save and post actions with credit system

### Niche Collections
- Curated meme packs by category (Crypto, Startups, Fitness, Gen Z, Dating)
- One-time 10 USDC unlock via Base MiniKit payments
- Weekly content updates
- Premium access control

### Analytics Dashboard
- Performance metrics by platform (Farcaster, Twitter, LinkedIn)
- Best posting times analysis
- Category performance breakdown
- Engagement trends and insights
- AI-powered recommendations

### Social Posting System
- One-tap posting to multiple platforms
- AI-generated caption suggestions
- Platform-specific optimizations
- Analytics tracking for posted content

### Base Integration
- OnchainKit for wallet connection
- MiniKit for in-frame payments and frame actions
- USDC micro-transactions
- Farcaster frame integration
- Social primitives and notifications

### User Management
- Farcaster ID-based authentication
- Credit system for premium features
- Saved memes collection
- Connected account management
- Preferences and settings

## API Endpoints

### Users
- `GET /api/users?fid={fid}` - Get user data
- `POST /api/users` - Create/update user
- `PUT /api/users` - Update user data

### Memes
- `GET /api/memes?timeWindow={1h|3h|6h}&category={category}` - Get memes
- `POST /api/memes` - Create meme
- `GET /api/memes/feed` - Get trending feed

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create collection

### Analytics
- `GET /api/analytics?userId={userId}` - Get user analytics
- `POST /api/analytics` - Create analytics event

### Frame Actions
- `POST /api/frame` - Handle frame interactions
- `GET /api/frame` - Frame metadata

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

### Production Checklist

- [ ] Set up production Redis instance
- [ ] Configure all API keys
- [ ] Set up USDC recipient wallet
- [ ] Configure Farcaster signer
- [ ] Test payment flows
- [ ] Verify frame actions
- [ ] Set up monitoring and logging

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Comprehensive error handling
- Loading states and error boundaries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our Discord community
