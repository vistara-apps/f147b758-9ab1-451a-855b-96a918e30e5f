'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FeedShell } from '@/components/FeedShell';
import { CollectionCard } from '@/components/CollectionCard';
import { PaymentModal } from '@/components/PaymentModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MemeCollection } from '@/lib/types';
import { TrendingUp } from 'lucide-react';
import { useMiniKit } from '@/components/MiniKitProvider';

export default function CollectionsPage() {
  const { fid } = useMiniKit();
  const [collections, setCollections] = useState<MemeCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<MemeCollection | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockCollection = async (collectionId: string) => {
    const collection = collections.find(c => c.collectionId === collectionId);
    if (collection) {
      setSelectedCollection(collection);
      setShowPaymentModal(true);
    }
  };

  const handleViewMemes = (collectionId: string) => {
    // Navigate to collection detail view
    console.log('View memes for collection:', collectionId);
  };

  const handlePaymentSuccess = (credits: number) => {
    // In a real implementation, this would unlock the collection
    console.log('Collection unlocked with payment');
    setShowPaymentModal(false);
    setSelectedCollection(null);
  };

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Niche Meme <span className="text-gradient">Collections</span>
          </h2>
          <p className="text-text-muted">
            Curated packs for your specific audience
          </p>
        </div>

        <FeedShell variant="grid">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.collectionId}
              collection={collection}
              isUnlocked={false} // In production, check user's unlocked collections
              onUnlock={handleUnlockCollection}
              onViewMemes={handleViewMemes}
            />
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

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        type="collection"
        collectionPrice={selectedCollection?.priceUsdc}
      />
    </div>
  );
}
