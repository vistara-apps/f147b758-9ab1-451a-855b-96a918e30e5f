'use client';

import { Heart, Share2, TrendingUp } from 'lucide-react';
import type { Meme } from '@/lib/types';
import Image from 'next/image';

interface MemeCardProps {
  meme: Meme;
  onSave: (memeId: string) => void;
  onPost: (memeId: string) => void;
  isSaved?: boolean;
}

export function MemeCard({ meme, onSave, onPost, isSaved = false }: MemeCardProps) {
  const getViralityClass = (score: number) => {
    if (score >= 80) return 'virality-high';
    if (score >= 60) return 'virality-medium';
    return 'virality-low';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      reddit: '🔴',
      twitter: '🐦',
      tiktok: '🎵',
    };
    return icons[platform] || '📱';
  };

  return (
    <div className="glass-card overflow-hidden group hover:border-accent/30 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={meme.imageUrl}
          alt="Meme"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Virality Badge */}
        <div className="absolute top-3 left-3">
          <div className={`virality-badge ${getViralityClass(meme.viralityScore)}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{meme.viralityScore}</span>
          </div>
        </div>

        {/* Platform Badge */}
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs">
            {getPlatformIcon(meme.platform)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-textMuted">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {meme.engagementVelocity}/hr
          </span>
          <span className="uppercase text-xs font-semibold text-accent">
            {meme.category}
          </span>
        </div>

        {/* Caption Suggestion */}
        <p className="text-sm line-clamp-2 text-fg/80">
          {meme.captionSuggestions[0]}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onSave(meme.memeId)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSaved
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'btn-secondary'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="text-sm">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          
          <button
            onClick={() => onPost(meme.memeId)}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
