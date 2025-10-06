'use client';

import { Meme } from '@/lib/types';
import { ActionButtons } from '@/app/components/ActionButtons';

interface MemeCardProps {
  meme: Meme;
  onSave?: () => void;
  onPost?: () => void;
  fid: string | null;
  variant?: 'default' | 'compact' | 'premium';
}

export function MemeCard({ meme, onSave, onPost, fid, variant = 'default' }: MemeCardProps) {

  if (variant === 'compact') {
    return (
      <div className="meme-card p-2">
        <div className="aspect-square bg-surface rounded-lg mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
          <div className="virality-badge">{meme.viralityScore}</div>
        </div>
        <p className="text-xs text-text-muted truncate">{meme.category}</p>
      </div>
    );
  }

  if (variant === 'premium') {
    return (
      <div className="meme-card p-4 relative">
        <div className="aspect-square bg-surface rounded-lg mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <p className="text-sm font-medium">Premium Content</p>
              <p className="text-xs text-text-muted mt-1">Unlock with credits</p>
            </div>
          </div>
        </div>
        <button className="btn-primary w-full text-sm">
          Unlock Pack - 10 USDC
        </button>
      </div>
    );
  }

  return (
    <div className="meme-card">
      <div className="aspect-square bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
        <div className="virality-badge">{meme.viralityScore}</div>
        
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            {meme.platform}
          </span>
          <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            {meme.trendingTimeWindow}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium capitalize">{meme.category}</p>
            <p className="text-xs text-text-muted">{meme.engagementVelocity} likes/hr</p>
          </div>
        </div>

        <ActionButtons
          memeId={meme.memeId}
          fid={fid}
          onSave={onSave}
          onPost={onPost}
        />
      </div>
    </div>
  );
}
