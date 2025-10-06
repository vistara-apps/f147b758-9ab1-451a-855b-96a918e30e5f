# MemeFlow - Base MiniApp

Catch viral memes before they peak with real-time trending content, one-tap social posting, and engagement analytics.

## Features

- 🔥 Real-time meme feed with virality scores
- 📊 Analytics dashboard for performance tracking
- 💎 Premium niche meme collections
- 🚀 One-tap posting to Farcaster, Twitter, LinkedIn
- 💰 Base-powered micro-transactions
- 📱 Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Wallet**: Coinbase Wallet integration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Add your OnchainKit API key to `.env.local`

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── page.tsx              # Main feed
├── collections/          # Niche meme packs
├── analytics/            # Performance dashboard
├── profile/              # User profile
├── layout.tsx            # Root layout
├── providers.tsx         # OnchainKit provider
└── globals.css           # Global styles

components/
├── Header.tsx            # App header with wallet
├── BottomNav.tsx         # Mobile navigation
├── MemeCard.tsx          # Meme display card
├── FeedShell.tsx         # Feed container
├── TimeFilter.tsx        # Time window filter
└── StatsCard.tsx         # Analytics card

lib/
├── types.ts              # TypeScript types
└── mock-data.ts          # Sample data
```

## Key Features Implementation

### Real-Time Meme Feed
- Displays trending memes from Reddit, Twitter, TikTok
- Virality scores (0-100) based on engagement velocity
- Time window filters (1h, 3h, 6h)
- Save and post actions

### Niche Collections
- Curated meme packs by category
- One-time 10 USDC unlock via Base
- Weekly content updates
- Categories: Crypto, Startups, Fitness, Gen Z, Dating

### Analytics Dashboard
- Performance metrics by platform
- Best posting times
- Category breakdown
- Engagement trends

### Base Integration
- OnchainKit for wallet connection
- MiniKit for in-frame payments
- USDC micro-transactions
- Farcaster social primitives

## Environment Variables

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here
```

Get your API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## License

MIT
