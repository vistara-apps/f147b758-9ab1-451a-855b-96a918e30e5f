# MemeFlow - Base MiniApp

Catch viral memes before they peak—curated, fresh, and ready to post.

A production-ready Base MiniApp that delivers real-time trending memes with one-tap social posting and engagement analytics for content creators and social media managers.

## ✨ Features

- 🔥 **Real-Time Meme Feed**: Scrollable feed displaying memes trending across Reddit, Twitter, and TikTok with virality scores
- 💾 **Save & Organize**: Save favorite memes to your personal collection
- 🚀 **One-Tap Social Posting**: Post memes directly to Farcaster, Twitter, or LinkedIn with AI-generated captions
- ⚡ **Micro-Transactions**: Pay with USDC on Base for premium content and credits
- 📊 **Analytics Dashboard**: Track meme performance and engagement metrics
- 📦 **Premium Collections**: Unlock curated niche meme packs (Crypto, Startups, Fitness, Gen Z, Dating)
- 🎯 **AI-Powered Captions**: Generate viral captions using OpenAI GPT-4 Vision

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Coinbase OnchainKit, MiniKit for Base integration
- **Social**: Farcaster MiniApp SDK
- **APIs**: Reddit, Twitter, Giphy, OpenAI, Farcaster Hub
- **Database**: Upstash Redis for caching and user data
- **Deployment**: Vercel-ready with production optimizations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for external services (see setup below)

### Installation

1. **Clone and install**:
```bash
git clone <repository-url>
cd memeflow
npm install
```

2. **Environment setup**:
```bash
cp .env.local.example .env.local
```

3. **Configure API keys** in `.env.local`:
```bash
# Required API Keys
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
GIPHY_API_KEY=your_giphy_api_key
OPENAI_API_KEY=your_openai_api_key

# Database
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Farcaster
NEXT_PUBLIC_FARCASTER_APP_FID=your_app_fid
```

4. **Run development server**:
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🔑 API Setup

### Coinbase OnchainKit
1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create a new project
3. Get your API key from the dashboard

### Reddit API
1. Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Create a new "script" app
3. Copy Client ID and Secret

### Twitter API
1. Apply for [Twitter Developer Account](https://developer.twitter.com/)
2. Create a project with "Essential" access
3. Generate Bearer Token

### Giphy API
1. Sign up at [Giphy Developers](https://developers.giphy.com/)
2. Create an app and get your API key

### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Ensure you have credits for GPT-4 Vision

### Upstash Redis
1. Sign up at [Upstash](https://upstash.com/)
2. Create a Redis database
3. Copy REST URL and Token

## 📱 Farcaster MiniApp Setup

1. **Register your MiniApp** with Farcaster
2. **Set your App FID** in environment variables
3. **Configure frame actions** in your Farcaster client
4. **Test frame interactions** using the frame URLs

## 🚢 Production Deployment

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy** and get your production URL

### Environment Variables for Production

Ensure all production environment variables are set:
- `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL
- `NEXT_PUBLIC_ENVIRONMENT`: `production`

### Database Setup

1. **Create production Redis** instance on Upstash
2. **Update environment variables** with production Redis credentials
3. **Run database migrations** if needed

## 📊 Analytics & Monitoring

- **Real-time analytics** available at `/analytics`
- **Error tracking** with built-in error boundaries
- **Performance monitoring** via Vercel Analytics
- **API rate limiting** implemented for all external services

## 🎨 Design System

MemeFlow uses a custom design system with:
- **Glassmorphism** effects for modern UI
- **Dark theme** optimized for mobile
- **Responsive grid** system
- **Custom color tokens** for consistency
- **Animation system** with cubic-bezier easing

## 🏗️ Project Structure

```
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── memes/          # Meme fetching endpoints
│   │   └── analytics/      # Analytics API
│   ├── components/         # Reusable UI components
│   ├── providers/          # React context providers
│   ├── analytics/          # Analytics dashboard page
│   ├── collections/        # Collections page
│   └── layout.tsx          # Root layout with providers
├── lib/
│   ├── api.ts             # API client utilities
│   ├── auth.ts            # Farcaster authentication
│   ├── payments.ts        # MiniKit payment integration
│   ├── farcaster.ts       # Farcaster posting
│   ├── openai.ts          # AI caption generation
│   ├── redis.ts           # Database operations
│   ├── config.ts          # Environment configuration
│   └── types.ts           # TypeScript definitions
├── components/
│   ├── ErrorBoundary.tsx  # Error handling
│   ├── LoadingSpinner.tsx # Loading states
│   └── ui/                # Base UI components
└── public/                # Static assets
```

## 🔒 Security

- **API key rotation** recommended every 90 days
- **Rate limiting** on all external API calls
- **Input validation** on all user inputs
- **Error boundaries** prevent app crashes
- **HTTPS only** in production

## 📈 Performance

- **API response caching** (5-10 minutes)
- **Image optimization** with Next.js Image component
- **Lazy loading** for meme feeds
- **Code splitting** for route-based loading
- **Bundle analysis** available via `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the [Issues](https://github.com/vistara-apps/memeflow/issues) page
- Review the [API Documentation](#api-setup)
- Ensure all environment variables are configured

## 🎯 Roadmap

- [ ] Twitter and LinkedIn posting integration
- [ ] Advanced analytics with charts
- [ ] Meme generation with AI
- [ ] Social features (likes, comments)
- [ ] Premium subscription tiers
- [ ] Mobile app version
