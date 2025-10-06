'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { MemeCard } from '@/components/MemeCard';
import { FeedShell } from '@/components/FeedShell';
import { TimeFilter } from '@/components/TimeFilter';
import { StatsCard } from '@/components/StatsCard';
import { InfiniteFeed } from '@/components/InfiniteFeed';
import { PaymentModal } from '@/components/PaymentModal';
import { PostingModal } from '@/components/PostingModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Meme, User } from '@/lib/types';
import { TrendingUp, Zap, Heart, Share2, Coins } from 'lucide-react';
import { useMiniKit } from '@/components/MiniKitProvider';

export default function HomePage() {
  const { fid, isConnected } = useMiniKit();
  const [timeWindow, setTimeWindow] = useState<'1h' | '3h' | '6h'>('1h');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [postingMeme, setPostingMeme] = useState<Meme | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'credits' | 'collection'>('credits');

  // Fetch memes on mount and when timeWindow changes
  useEffect(() => {
    fetchMemes();
  }, [timeWindow]);

  // Fetch user data
  useEffect(() => {
    if (fid) {
      fetchUser();
    }
  }, [fid]);

  const fetchMemes = async () => {
    try {
      const response = await fetch(`/api/memes/feed?timeWindow=${timeWindow}&limit=20`);
      const data = await response.json();
      setMemes(data.memes || []);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (!fid) return;

    try {
      const response = await fetch(`/api/users?fid=${fid}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSaveMeme = async (memeId: string) => {
    if (!fid) return;

    try {
      const response = await fetch('/api/frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_meme',
          fid,
          memeId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.user);
        // Update local memes state if needed
      }
    } catch (error) {
      console.error('Error saving meme:', error);
    }
  };

  const handlePostMeme = async (memeId: string) => {
    const meme = memes.find(m => m.memeId === memeId);
    if (meme) {
      setPostingMeme(meme);
    }
  };

  const handlePostSubmit = async (platform: string, caption: string) => {
    if (!fid || !postingMeme) return;

    try {
      const response = await fetch('/api/frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post_now',
          fid,
          memeId: postingMeme.memeId,
          platform,
          caption,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.user);
        setPostingMeme(null);
      } else if (result.needsCredits) {
        setPostingMeme(null);
        setPaymentType('credits');
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Error posting meme:', error);
    }
  };

  const handleBuyCredits = () => {
    setPaymentType('credits');
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (credits: number) => {
    if (user) {
      setUser({ ...user, creditsRemaining: (user.creditsRemaining || 0) + credits });
    }
    setShowPaymentModal(false);
  };

  const savedMemesCount = user?.savedMemes?.length || 0;
  const creditsRemaining = user?.creditsRemaining || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            value={memes.length}
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
            value={savedMemesCount}
          />
          <StatsCard
            icon={Coins}
            label="Credits"
            value={creditsRemaining.toString()}
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
          <InfiniteFeed
            initialMemes={memes}
            timeWindow={timeWindow}
            onSaveMeme={handleSaveMeme}
            onPostMeme={handlePostMeme}
          />
        </FeedShell>

        {/* Premium Packs Teaser */}
        <div className="mt-12">
          <FeedShell
            variant="grid"
            title="Premium Meme Packs"
            action={
              <button
                onClick={() => window.location.href = '/collections'}
                className="btn-primary text-sm"
              >
                View Collections
              </button>
            }
          >
            <div className="text-center py-8 text-text-muted">
              <p>Unlock curated meme collections</p>
              <p className="text-sm mt-1">50+ memes per pack, updated weekly</p>
            </div>
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
              <button onClick={handleBuyCredits} className="btn-primary">
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

      {/* Modals */}
      <PostingModal
        isOpen={!!postingMeme}
        onClose={() => setPostingMeme(null)}
        meme={postingMeme}
        onPost={handlePostSubmit}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        type={paymentType}
      />
    </div>
  );
}
