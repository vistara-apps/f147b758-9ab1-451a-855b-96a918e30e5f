'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Meme } from '@/lib/types';
import { Send, Image as ImageIcon, Hash, AtSign } from 'lucide-react';

interface PostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meme: Meme | null;
  onPost: (platform: string, caption: string) => Promise<void>;
}

export function PostingModal({ isOpen, onClose, meme, onPost }: PostingModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('farcaster');
  const [caption, setCaption] = useState<string>('');
  const [posting, setPosting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (meme && isOpen) {
      // Set default caption from meme suggestions
      setCaption(meme.captionSuggestions[0] || '');
    }
  }, [meme, isOpen]);

  const handlePost = async () => {
    if (!meme || !caption.trim()) return;

    setPosting(true);
    try {
      await onPost(selectedPlatform, caption);
      setCompleted(true);
      setTimeout(() => {
        onClose();
        setCompleted(false);
        setCaption('');
      }, 2000);
    } catch (error) {
      console.error('Posting failed:', error);
    } finally {
      setPosting(false);
    }
  };

  const insertHashtag = (tag: string) => {
    setCaption(prev => prev + ` #${tag}`);
  };

  const insertMention = (mention: string) => {
    setCaption(prev => prev + ` @${mention}`);
  };

  if (!meme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Post Meme
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meme Preview */}
          <div className="relative rounded-lg overflow-hidden bg-surface">
            <img
              src={meme.imageUrl}
              alt="Meme preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {meme.viralityScore}
              </Badge>
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Post to:</label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farcaster">Farcaster</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Caption Editor */}
          <div>
            <label className="text-sm font-medium mb-2 block">Caption:</label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for your post..."
              className="min-h-[100px] resize-none"
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertHashtag('meme')}
                  className="h-8 px-2"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  meme
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertHashtag(meme.category)}
                  className="h-8 px-2"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {meme.category}
                </Button>
              </div>
              <span className="text-xs text-text-muted">
                {caption.length}/280
              </span>
            </div>
          </div>

          {/* Caption Suggestions */}
          <div>
            <label className="text-sm font-medium mb-2 block">Suggestions:</label>
            <div className="flex flex-wrap gap-2">
              {meme.captionSuggestions.slice(1).map((suggestion, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCaption(suggestion)}
                  className="text-xs"
                >
                  {suggestion.length > 30 ? suggestion.substring(0, 27) + '...' : suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={posting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={posting || completed || !caption.trim()}
              className="flex-1"
            >
              {posting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : completed ? (
                'Posted! 🎉'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post to {selectedPlatform}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

