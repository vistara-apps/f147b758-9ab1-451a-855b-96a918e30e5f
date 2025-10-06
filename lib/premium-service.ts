import { userService } from './user-service';
import type { MemeCollection } from './types';

export interface PackAccess {
  packId: string;
  unlockedAt: string;
  expiresAt?: string; // For subscription-based packs
}

export class PremiumService {
  // Available meme packs
  private readonly availablePacks: MemeCollection[] = [
    {
      collectionId: 'crypto-pack',
      name: 'Crypto Memes Pack',
      niche: 'crypto',
      memeIds: [], // Would be populated with actual meme IDs
      priceUsdc: 10,
      updatedAt: new Date().toISOString(),
    },
    {
      collectionId: 'startup-pack',
      name: 'Startup Memes Pack',
      niche: 'startup',
      memeIds: [],
      priceUsdc: 10,
      updatedAt: new Date().toISOString(),
    },
    {
      collectionId: 'fitness-pack',
      name: 'Fitness Memes Pack',
      niche: 'fitness',
      memeIds: [],
      priceUsdc: 10,
      updatedAt: new Date().toISOString(),
    },
    {
      collectionId: 'genz-pack',
      name: 'Gen Z Memes Pack',
      niche: 'genz',
      memeIds: [],
      priceUsdc: 10,
      updatedAt: new Date().toISOString(),
    },
    {
      collectionId: 'dating-pack',
      name: 'Dating Memes Pack',
      niche: 'dating',
      memeIds: [],
      priceUsdc: 10,
      updatedAt: new Date().toISOString(),
    },
  ];

  // In-memory storage for demo - in production, use database
  private packAccess: Map<string, PackAccess[]> = new Map();

  async getAvailablePacks(): Promise<MemeCollection[]> {
    return this.availablePacks;
  }

  async getPackById(packId: string): Promise<MemeCollection | null> {
    return this.availablePacks.find(pack => pack.collectionId === packId) || null;
  }

  async unlockPackForUser(fid: string, packId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if pack exists
      const pack = await this.getPackById(packId);
      if (!pack) {
        return { success: false, error: 'Pack not found' };
      }

      // Check if user already has access
      const userAccess = this.packAccess.get(fid) || [];
      const hasAccess = userAccess.some(access => access.packId === packId);

      if (hasAccess) {
        return { success: false, error: 'Pack already unlocked' };
      }

      // Grant access
      const access: PackAccess = {
        packId,
        unlockedAt: new Date().toISOString(),
        // No expiration for one-time purchases
      };

      userAccess.push(access);
      this.packAccess.set(fid, userAccess);

      // Update user tier if this is their first pack
      if (userAccess.length === 1) {
        await userService.getOrCreateUser(fid); // Ensure user exists
        // In a real implementation, update user tier in database
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to unlock pack for user:', error);
      return { success: false, error: 'Failed to unlock pack' };
    }
  }

  async hasPackAccess(fid: string, packId: string): Promise<boolean> {
    try {
      const userAccess = this.packAccess.get(fid) || [];
      return userAccess.some(access => access.packId === packId);
    } catch (error) {
      console.error('Failed to check pack access:', error);
      return false;
    }
  }

  async getUserUnlockedPacks(fid: string): Promise<PackAccess[]> {
    try {
      return this.packAccess.get(fid) || [];
    } catch (error) {
      console.error('Failed to get user unlocked packs:', error);
      return [];
    }
  }

  async getPackMemes(packId: string, fid: string): Promise<any[]> {
    try {
      // Check if user has access
      const hasAccess = await this.hasPackAccess(fid, packId);
      if (!hasAccess) {
        return [];
      }

      // In a real implementation, return actual memes from the pack
      // For now, return mock data
      return [
        {
          memeId: `${packId}-1`,
          imageUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=400&fit=crop',
          sourceUrl: `https://meme.example.com/${packId}`,
          platform: 'reddit',
          viralityScore: 85,
          trendingTimeWindow: '1h' as const,
          category: packId.replace('-pack', '') as any,
          captionSuggestions: ['Premium meme content!'],
          engagementVelocity: 100,
          discoveredAt: new Date().toISOString(),
        },
        // Add more mock memes...
      ];
    } catch (error) {
      console.error('Failed to get pack memes:', error);
      return [];
    }
  }

  // Subscription-based premium features
  async upgradeToPremium(fid: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await userService.getOrCreateUser(fid);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.tierType === 'premium') {
        return { success: false, error: 'User already has premium access' };
      }

      // In a real implementation, this would handle subscription payment
      // For now, just update the user tier
      user.tierType = 'premium';
      // Note: We can't directly modify the user object here since userService handles persistence

      return { success: true };
    } catch (error) {
      console.error('Failed to upgrade user to premium:', error);
      return { success: false, error: 'Failed to upgrade to premium' };
    }
  }

  async hasPremiumAccess(fid: string): Promise<boolean> {
    try {
      return await userService.hasPremiumAccess(fid);
    } catch (error) {
      console.error('Failed to check premium access:', error);
      return false;
    }
  }

  // Analytics for premium features
  async getPremiumStats(): Promise<{
    totalUsers: number;
    premiumUsers: number;
    totalPacksUnlocked: number;
    popularPacks: Array<{ packId: string; unlockCount: number }>;
  }> {
    // Mock analytics data
    return {
      totalUsers: 1250,
      premiumUsers: 340,
      totalPacksUnlocked: 890,
      popularPacks: [
        { packId: 'crypto-pack', unlockCount: 245 },
        { packId: 'genz-pack', unlockCount: 198 },
        { packId: 'startup-pack', unlockCount: 156 },
        { packId: 'fitness-pack', unlockCount: 134 },
        { packId: 'dating-pack', unlockCount: 157 },
      ],
    };
  }
}

export const premiumService = new PremiumService();

