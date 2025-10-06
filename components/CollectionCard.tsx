'use client';

import { MemeCollection } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Lock, Star } from 'lucide-react';
import { useState } from 'react';

interface CollectionCardProps {
  collection: MemeCollection;
  isUnlocked?: boolean;
  onUnlock: (collectionId: string) => void;
  onViewMemes: (collectionId: string) => void;
}

export function CollectionCard({
  collection,
  isUnlocked = false,
  onUnlock,
  onViewMemes,
}: CollectionCardProps) {
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await onUnlock(collection.collectionId);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {/* Collection preview image */}
        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <div className="text-white text-center">
            <Star className="w-12 h-12 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">{collection.name}</h3>
            <p className="text-sm opacity-90 capitalize">{collection.niche} Memes</p>
          </div>
        </div>

        {/* Overlay for locked collections */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Premium Collection</p>
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={isUnlocked ? "default" : "secondary"} className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {collection.priceUsdc} USDC
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium">{collection.name}</h4>
            <p className="text-sm text-text-muted capitalize">{collection.niche}</p>
          </div>
          <Badge variant="outline">
            {collection.memeIds.length} memes
          </Badge>
        </div>

        <p className="text-sm text-text-muted mb-4">
          Curated {collection.niche} memes updated weekly with fresh content.
        </p>

        <div className="flex gap-2">
          {isUnlocked ? (
            <Button
              onClick={() => onViewMemes(collection.collectionId)}
              className="flex-1"
            >
              View Collection
            </Button>
          ) : (
            <Button
              onClick={handleUnlock}
              disabled={unlocking}
              className="flex-1"
            >
              {unlocking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Unlocking...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Unlock ({collection.priceUsdc} USDC)
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

