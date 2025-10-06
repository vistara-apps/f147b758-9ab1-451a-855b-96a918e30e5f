'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { premiumService } from '@/lib/premium-service';
import { paymentService } from '@/lib/payment-service';
import { userService } from '@/lib/user-service';
import type { MemeCollection, User } from '@/lib/types';
import { Lock, Unlock, Package, Sparkles, TrendingUp } from 'lucide-react';

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState('collections');
  const [collections, setCollections] = useState<MemeCollection[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [unlockedPacks, setUnlockedPacks] = useState<string[]>([]);
  const [fid] = useState<string>('demo-user'); // In real app, get from MiniKit
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollectionsData();
  }, []);

  const loadCollectionsData = async () => {
    try {
      setIsLoading(true);
      const [collectionsData, userData, unlockedData] = await Promise.all([
        premiumService.getAvailablePacks(),
        userService.getOrCreateUser(fid),
        premiumService.getUserUnlockedPacks(fid),
      ]);

      setCollections(collectionsData);
      setUser(userData);
      setUnlockedPacks(unlockedData.map(pack => pack.packId));
    } catch (error) {
      console.error('Failed to load collections data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockPack = async (packId: string, price: string) => {
    try {
      // In a real implementation, this would trigger MiniKit payment
      // For demo, we'll simulate the unlock
      const result = await premiumService.unlockPackForUser(fid, packId);
      if (result.success) {
        setUnlockedPacks([...unlockedPacks, packId]);
        // Update user to premium if this is their first pack
        if (unlockedPacks.length === 0) {
          const updatedUser = await userService.getOrCreateUser(fid);
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Failed to unlock pack:', error);
    }
  };

  const CollectionCard = ({ collection }: { collection: MemeCollection }) => {
    const isUnlocked = unlockedPacks.includes(collection.collectionId);

    return (
      <div className="glass-card p-6 hover:scale-105 transition-transform duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{collection.name}</h3>
              <p className="text-sm text-textMuted capitalize">{collection.niche} memes</p>
            </div>
          </div>
          {isUnlocked ? (
            <Unlock className="w-5 h-5 text-success" />
          ) : (
            <Lock className="w-5 h-5 text-warning" />
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-textMuted">
            Curated collection of trending {collection.niche} memes, updated weekly.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {collection.priceUsdc} USDC
              </span>
            </div>

            {isUnlocked ? (
              <span className="text-sm text-success font-medium">Unlocked</span>
            ) : (
              <button
                onClick={() => handleUnlockPack(collection.collectionId, collection.priceUsdc.toString())}
                className="btn-primary text-sm px-4 py-2"
              >
                Unlock Pack
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <Header
        credits={user?.creditsRemaining || 0}
        onBuyCredits={() => {}} // Collections page doesn't need buy credits
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="glass-card p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gradient">
              Premium Meme Collections
            </h1>
          </div>
          <p className="text-textMuted max-w-2xl mx-auto">
            Unlock curated meme packs tailored to specific audiences and niches
          </p>
        </div>

        {/* User Status */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">
                Account Status: <span className="text-primary capitalize">{user?.tierType || 'Free'}</span>
              </p>
              <p className="text-sm text-textMuted">
                {unlockedPacks.length} of {collections.length} packs unlocked
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-textMuted">Credits</p>
              <p className="font-semibold text-text">{user?.creditsRemaining || 0}</p>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-textMuted">Loading collections...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.collectionId} collection={collection} />
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Why Premium Packs?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-text mb-2">Curated Content</h4>
              <p className="text-sm text-textMuted">
                Hand-picked memes that resonate with specific audiences
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-text mb-2">Weekly Updates</h4>
              <p className="text-sm text-textMuted">
                Fresh content added regularly to keep your feed trending
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-text mb-2">Higher Engagement</h4>
              <p className="text-sm text-textMuted">
                Niche-specific content drives 3-5x more engagement
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
