# MemeFlow - Base MiniApp

Catch viral memes before they peak—curated, fresh, and ready to post.

## Features

- 🔥 Real-time trending meme feed with virality scores
- 💾 Save favorite memes for later
- 🚀 One-tap social posting to Farcaster, Twitter, LinkedIn
- ⚡ Micro-transaction payment system via Base
- 📊 Analytics dashboard (coming soon)
- 📦 Premium meme collections (coming soon)

## Tech Stack

- Next.js 15 with App Router
- React 19
- OnchainKit for Base integration
- Tailwind CSS for styling
- TypeScript for type safety

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

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Theme Support

MemeFlow supports multiple blockchain themes:
- Default: Vibrant purple/pink gradient
- Celo: Black & yellow with sharp borders
- Solana: Dark purple with magenta accents
- Base: Dark blue with Base blue accents
- Coinbase: Navy with Coinbase blue

Visit `/theme-preview` to see all themes.

## Project Structure

```
app/
├── components/       # Reusable UI components
├── page.tsx         # Main feed page
├── layout.tsx       # Root layout
├── providers.tsx    # OnchainKit provider
└── globals.css      # Global styles

lib/
├── types.ts         # TypeScript interfaces
└── mockData.ts      # Mock data for development
```

## License

MIT
