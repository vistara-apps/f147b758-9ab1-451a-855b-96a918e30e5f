'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Send } from 'lucide-react';
import { useMemeActions } from '@/lib/hooks/useMemes';
import { PostingModal } from './PostingModal';

interface ActionButtonsProps {
  memeId: string;
  fid: string | null;
  onSave?: () => void;
  onPost?: () => void;
}

export function ActionButtons({ memeId, fid, onSave, onPost }: ActionButtonsProps) {
  const [showPostingModal, setShowPostingModal] = useState(false);
  const { saveMeme, postMeme, isLoading } = useMemeActions();

  const handleSave = async () => {
    if (!fid) return;

    try {
      await saveMeme(fid, memeId);
      onSave?.();
    } catch (error) {
      console.error('Failed to save meme:', error);
    }
  };

  const handlePost = () => {
    setShowPostingModal(true);
  };

  const handlePostConfirm = async (platform: string, caption: string) => {
    if (!fid) return;

    try {
      await postMeme(fid, memeId, platform, caption);
      setShowPostingModal(false);
      onPost?.();
    } catch (error) {
      console.error('Failed to post meme:', error);
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSave}
          disabled={isLoading || !fid}
          className="flex-1"
        >
          <Heart className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handlePost}
          disabled={isLoading || !fid}
          className="flex-1"
        >
          <Send className="w-4 h-4 mr-2" />
          Post
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="px-3"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <PostingModal
        isOpen={showPostingModal}
        onClose={() => setShowPostingModal(false)}
        onPost={handlePostConfirm}
        isLoading={isLoading}
      />
    </>
  );
}

