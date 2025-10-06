'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Meme } from '@/lib/types';
import { Coins, Heart, Share2, Settings, Wallet } from 'lucide-react';
import { useMiniKit } from './MiniKitProvider';

interface UserProfileProps {
  user: User | null;
  savedMemes: Meme[];
  onUpdateProfile: (updates: Partial<User>) => void;
}

export function UserProfile({ user, savedMemes, onUpdateProfile }: UserProfileProps) {
  const { isConnected, walletAddress, connect } = useMiniKit();
  const [editing, setEditing] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-text-muted mb-6">
          Connect your Base wallet to access your profile and saved memes
        </p>
        <Button onClick={connect}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback>
                  {user.fid.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span>FID: {user.fid}</span>
                  <Badge variant={user.tierType === 'premium' ? 'default' : 'secondary'}>
                    {user.tierType}
                  </Badge>
                </div>
                {walletAddress && (
                  <div className="text-sm text-text-muted font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                )}
              </div>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-2xl font-bold">{user.creditsRemaining}</span>
              </div>
              <p className="text-xs text-text-muted">Credits</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-2xl font-bold">{savedMemes.length}</span>
              </div>
              <p className="text-xs text-text-muted">Saved Memes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Share2 className="w-4 h-4 text-blue-500" />
                <span className="text-2xl font-bold">0</span>
              </div>
              <p className="text-xs text-text-muted">Posts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold">0</span>
              </div>
              <p className="text-xs text-text-muted">Engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(user.connectedAccounts).map(([platform, username]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium capitalize">
                      {platform[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium capitalize">{platform}</div>
                    <div className="text-sm text-text-muted">
                      {username || 'Not connected'}
                    </div>
                  </div>
                </div>
                <Badge variant={username ? 'default' : 'secondary'}>
                  {username ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Favorite Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {user.preferences.niches.map((niche) => (
                  <Badge key={niche} variant="outline" className="capitalize">
                    {niche}
                  </Badge>
                ))}
                {user.preferences.niches.length === 0 && (
                  <span className="text-sm text-text-muted">No preferences set</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-text-muted">
                  Receive updates about viral memes
                </div>
              </div>
              <Badge variant={user.preferences.notificationSettings ? 'default' : 'secondary'}>
                {user.preferences.notificationSettings ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Memes Preview */}
      {savedMemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Saved Memes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {savedMemes.slice(0, 6).map((meme) => (
                <div key={meme.memeId} className="relative group">
                  <img
                    src={meme.imageUrl}
                    alt="Saved meme"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Badge variant="secondary" className="text-xs">
                      {meme.viralityScore}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {savedMemes.length > 6 && (
              <div className="text-center mt-4">
                <Button variant="outline">
                  View All Saved Memes ({savedMemes.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

