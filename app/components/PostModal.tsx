'use client';

import { X, Send } from 'lucide-react';
import { useState } from 'react';
import type { Meme } from '@/lib/types';
import Image from 'next/image';

interface PostModalProps {
  meme: Meme | null;
  isOpen: boolean;
  onClose: () => void;
  onPost: (platform: string, caption: string) => void;
}

export function PostModal({ meme, isOpen, onClose, onPost }: PostModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('farcaster');
  const [caption, setCaption] = useState('');

  if (!isOpen || !meme) return null;

  const platforms = [
    { id: 'farcaster', name: 'Farcaster', icon: '🟣' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  ];

  const handlePost = () => {
    onPost(selectedPlatform, caption || meme.captionSuggestions[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Post Meme</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Meme Preview */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-surface">
            <Image
              src={meme.imageUrl}
              alt="Meme preview"
              fill
              className="object-cover"
            />
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">
              Select Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-surface hover:bg-surfaceHover text-fg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{platform.icon}</span>
                    <span>{platform.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Caption Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={meme.captionSuggestions[0]}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-fg placeholder:text-textMuted focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
              rows={4}
            />
          </div>

          {/* Suggested Captions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">
              Suggested Captions
            </label>
            <div className="space-y-2">
              {meme.captionSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setCaption(suggestion)}
                  className="w-full text-left px-4 py-2 bg-surface hover:bg-surfaceHover rounded-lg text-sm transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Post Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
