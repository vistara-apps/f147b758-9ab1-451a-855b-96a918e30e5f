'use client';

import { useState, useEffect, useCallback } from 'react';
import { MemeCard } from './MemeCard';
import { Meme } from '@/lib/types';
import { useInView } from 'react-intersection-observer';

interface InfiniteFeedProps {
  initialMemes: Meme[];
  timeWindow: '1h' | '3h' | '6h';
  category?: string;
  onSaveMeme: (memeId: string) => void;
  onPostMeme: (memeId: string) => void;
}

export function InfiniteFeed({
  initialMemes,
  timeWindow,
  category,
  onSaveMeme,
  onPostMeme,
}: InfiniteFeedProps) {
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const loadMoreMemes = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        timeWindow,
        limit: '20',
        offset: (page * 20).toString(),
      });

      if (category) {
        params.set('category', category);
      }

      const response = await fetch(`/api/memes/feed?${params}`);
      const data = await response.json();

      if (data.memes.length === 0) {
        setHasMore(false);
      } else {
        setMemes(prev => [...prev, ...data.memes]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more memes:', error);
    } finally {
      setLoading(false);
    }
  }, [timeWindow, category, page, loading, hasMore]);

  useEffect(() => {
    if (inView) {
      loadMoreMemes();
    }
  }, [inView, loadMoreMemes]);

  // Reset when filters change
  useEffect(() => {
    setMemes(initialMemes);
    setPage(1);
    setHasMore(true);
  }, [timeWindow, category, initialMemes]);

  return (
    <div className="space-y-4">
      {memes.map((meme) => (
        <MemeCard
          key={meme.memeId}
          meme={meme}
          onSave={onSaveMeme}
          onPost={onPostMeme}
        />
      ))}

      {/* Loading indicator and sentinel */}
      <div ref={ref} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center space-x-2 text-text-muted">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Loading more memes...</span>
          </div>
        )}

        {!hasMore && memes.length > 0 && (
          <div className="text-text-muted text-center">
            <p>You've seen all the trending memes! 🎉</p>
            <p className="text-sm mt-1">Check back later for fresh content.</p>
          </div>
        )}

        {!loading && hasMore && (
          <div className="text-text-muted text-sm">
            Scroll for more memes
          </div>
        )}
      </div>
    </div>
  );
}

