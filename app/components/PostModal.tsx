'use client';

import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Meme } from '@/lib/types';
import Image from 'next/image';
import { generateCaptions } from '@/lib/openai';
import { postMemeCast } from '@/lib/farcaster';
import { useAuth } from '@/app/providers/AuthProvider';

interface PostModalProps {
  meme: Meme | null;
  isOpen: boolean;
  onClose: () => void;
  onPost: (platform: string, caption: string) => void;
}

export function PostModal({ meme, isOpen, onClose, onPost }: PostModalProps) {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('farcaster');
  const [caption, setCaption] = useState('');
  const [aiCaptions, setAiCaptions] = useState<string[]>([]);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Reset state when modal opens with new meme
  useEffect(() => {
    if (isOpen && meme) {
      setCaption('');
      setAiCaptions([]);
      setSelectedPlatform('farcaster');
    }
  }, [isOpen, meme]);

  // Generate AI captions when meme changes
  useEffect(() => {
    if (meme && isOpen) {
      generateAiCaptions();
    }
  }, [meme, isOpen]);

  const generateAiCaptions = async () => {
    if (!meme) return;

    setIsGeneratingCaptions(true);
    try {
      const result = await generateCaptions({
        meme,
        platform: selectedPlatform as 'farcaster' | 'twitter' | 'linkedin',
        maxLength: selectedPlatform === 'twitter' ? 280 : 500,
      });

      if (result.success && result.captions) {
        setAiCaptions(result.captions);
        // Set first AI caption as default
        if (!caption) {
          setCaption(result.captions[0]);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI captions:', error);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  if (!isOpen || !meme) return null;

  const platforms = [
    { id: 'farcaster', name: 'Farcaster', icon: '🟣' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  ];

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    // Regenerate captions for new platform
    setTimeout(() => generateAiCaptions(), 100);
  };

  const handlePost = async () => {
    if (!user?.fid) {
      alert('Please connect your Farcaster account first');
      return;
    }

    setIsPosting(true);
    try {
      const finalCaption = caption || meme.captionSuggestions[0];

      if (selectedPlatform === 'farcaster') {
        // Post to Farcaster
        const result = await postMemeCast(user.fid, meme, finalCaption);
        if (result.success) {
          onPost(selectedPlatform, finalCaption);
          onClose();
        } else {
          alert(`Failed to post: ${result.error}`);
        }
      } else {
        // For other platforms, use the callback (would need additional integrations)
        onPost(selectedPlatform, finalCaption);
        onClose();
      }
    } catch (error) {
      console.error('Posting failed:', error);
      alert('Failed to post meme. Please try again.');
    } finally {
      setIsPosting(false);
    }
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
                  onClick={() => handlePlatformChange(platform.id)}
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

          {/* AI-Generated Captions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-textMuted">
                AI-Generated Captions
              </label>
              <button
                onClick={generateAiCaptions}
                disabled={isGeneratingCaptions}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 disabled:opacity-50"
              >
                {isGeneratingCaptions ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Regenerate
              </button>
            </div>
            <div className="space-y-2">
              {isGeneratingCaptions ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="ml-2 text-xs text-textMuted">Generating captions...</span>
                </div>
              ) : aiCaptions.length > 0 ? (
                aiCaptions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setCaption(suggestion)}
                    className="w-full text-left px-4 py-2 bg-surface hover:bg-surfaceHover rounded-lg text-sm transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                // Fallback to original suggestions
                meme.captionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setCaption(suggestion)}
                    className="w-full text-left px-4 py-2 bg-surface hover:bg-surfaceHover rounded-lg text-sm transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            disabled={isPosting}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isPosting ? 'Posting...' : 'Post Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
