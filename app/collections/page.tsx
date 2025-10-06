'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FeedShell } from '@/components/FeedShell';
import { mockCollections } from '@/lib/mock-data';
import { Lock, TrendingUp } from 'lucide-react';

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Niche Meme <span className="text-gradient">Collections</span>
          </h2>
          <p className="text-text-muted">
            Curated packs for your specific audience
          </p>
        </div>

        <FeedShell variant="grid">
          {mockCollections.map((collection) => (
            <div key={collection.collectionId} className="meme-card">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {collection.niche === 'crypto' && '₿'}
                    {collection.niche === 'startup' && '🚀'}
                    {collection.niche === 'genz' && '✨'}
                  </div>
                  <Lock className="w-8 h-8 mx-auto text-white/50" />
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-1">{collection.name}</h3>
                <p className="text-sm text-text-muted mb-3">
                  {collection.memeIds.length}+ curated memes
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">
                    {collection.priceUsdc} USDC
                  </span>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span>Updated weekly</span>
                  </div>
                </div>
                
                <button className="btn-primary w-full text-sm">
                  Unlock Pack
                </button>
              </div>
            </div>
          ))}
        </FeedShell>

        <div className="mt-12 glass-card p-8 rounded-lg">
          <h3 className="text-xl font-bold mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Choose Your Niche</h4>
                <p className="text-sm text-text-muted">
                  Select a pack that matches your audience
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">One-Time Payment</h4>
                <p className="text-sm text-text-muted">
                  Pay 10 USDC via Base Wallet - instant access
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Fresh Content Weekly</h4>
                <p className="text-sm text-text-muted">
                  Get 20+ new memes added every week automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
