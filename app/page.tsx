'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { MemeCard } from '@/components/MemeCard';
import { FeedShell } from '@/components/FeedShell';
import { TimeFilter } from '@/components/TimeFilter';
import { StatsCard } from '@/components/StatsCard';
import { mockMemes } from '@/lib/mock-data';
import { TrendingUp, Zap, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [timeWindow, setTimeWindow] = useState<'1h' | '3h' | '6h'>('1h');
  const [savedMemes, setSavedMemes] = useState<string[]>([]);

  const filteredMemes = mockMemes.filter(
    meme => meme.trendingTimeWindow === timeWindow
  );

  const handleSaveMeme = (memeId: string) => {
    setSavedMemes(prev => 
      prev.includes(memeId) 
        ? prev.filter(id => id !== memeId)
        : [...prev, memeId]
    );
  };

  const handlePostMeme = (memeId: string) => {
    // In production, this would open the posting modal
    console.log('Posting meme:', memeId);
  };

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Catch Viral Memes <span className="text-gradient">Before They Peak</span>
          </h2>
          <p className="text-text-muted">
            Real-time trending content with virality scores
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={TrendingUp}
            label="Trending Now"
            value={mockMemes.length}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            icon={Zap}
            label="Avg Virality"
            value="89"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            icon={Heart}
            label="Saved Memes"
            value={savedMemes.length}
          />
          <StatsCard
            icon={Share2}
            label="Posts Today"
            value="0"
          />
        </div>

        {/* Time Filter */}
        <div className="mb-6">
          <TimeFilter onFilterChange={setTimeWindow} />
        </div>

        {/* Meme Feed */}
        <FeedShell 
          variant="grid"
          title="Trending Memes"
          action={
            <button className="text-sm text-primary hover:underline">
              View All
            </button>
          }
        >
          {filteredMemes.map((meme) => (
            <MemeCard
              key={meme.memeId}
              meme={meme}
              onSave={handleSaveMeme}
              onPost={handlePostMeme}
            />
          ))}
        </FeedShell>

        {/* Premium Packs Teaser */}
        <div className="mt-12">
          <FeedShell 
            variant="grid"
            title="Premium Meme Packs"
            action={
              <button className="btn-primary text-sm">
                View Collections
              </button>
            }
          >
            {[1, 2, 3, 4].map((i) => (
              <MemeCard
                key={i}
                meme={mockMemes[0]}
                variant="premium"
              />
            ))}
          </FeedShell>
        </div>

        {/* CTA Section */}
        <div className="mt-12 glass-card p-8 rounded-lg text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">
              Ready to Level Up Your Content Game?
            </h3>
            <p className="text-text-muted mb-6">
              Get unlimited access to fresh memes, AI-powered captions, and analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Buy 1000 Credits - 100 USDC
              </button>
              <button className="btn-secondary">
                Explore Free Tier
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
