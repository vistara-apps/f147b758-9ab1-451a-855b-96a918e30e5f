'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (platform: string, caption: string) => void;
  isLoading: boolean;
}

const PLATFORMS = [
  { id: 'farcaster', name: 'Farcaster', icon: '🟣' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
];

export function PostingModal({ isOpen, onClose, onPost, isLoading }: PostingModalProps) {
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState('farcaster');

  const handlePost = () => {
    if (!caption.trim()) return;
    onPost(platform, caption);
    setCaption('');
  };

  const suggestedCaptions = [
    "This meme is too real! 😂",
    "Can't stop laughing at this one 🔥",
    "Meme of the day! What's yours? 🤔",
    "This perfectly captures my week 📈",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Post Meme</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption for your meme..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>Suggested Captions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedCaptions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setCaption(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Platform</Label>
            <RadioGroup value={platform} onValueChange={setPlatform} className="mt-2">
              {PLATFORMS.map((p) => (
                <div key={p.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={p.id} id={p.id} />
                  <Label htmlFor={p.id} className="flex items-center space-x-2 cursor-pointer">
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={!caption.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Posting...' : 'Post Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

