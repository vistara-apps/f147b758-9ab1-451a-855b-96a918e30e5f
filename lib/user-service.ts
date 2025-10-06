import { farcasterAPI } from './api/farcaster';
import type { User } from './types';

export class UserService {
  // In-memory storage for demo - in production, use database
  private users: Map<string, User> = new Map();

  async getOrCreateUser(fid: string): Promise<User | null> {
    try {
      // Check if user exists in memory
      let user = this.users.get(fid);

      if (!user) {
        // Try to fetch from Farcaster API
        const farcasterUser = await farcasterAPI.getUserProfile(fid);

        if (farcasterUser) {
          user = farcasterUser;
          this.users.set(fid, user);
        } else {
          // Create new user with default values
          user = {
            fid,
            walletAddress: '', // Will be set when they connect wallet
            creditsRemaining: 5, // Free daily credits
            tierType: 'free',
            savedMemes: [],
            connectedAccounts: {},
            preferences: {
              niches: ['crypto', 'genz'],
              notificationSettings: true,
            },
          };
          this.users.set(fid, user);
        }
      }

      return user;
    } catch (error) {
      console.error('Failed to get or create user:', error);
      return null;
    }
  }

  async updateUserCredits(fid: string, creditsToAdd: number): Promise<User | null> {
    try {
      const user = await this.getOrCreateUser(fid);
      if (!user) return null;

      user.creditsRemaining += creditsToAdd;
      this.users.set(fid, user);

      return user;
    } catch (error) {
      console.error('Failed to update user credits:', error);
      return null;
    }
  }

  async deductUserCredits(fid: string, creditsToDeduct: number): Promise<{ success: boolean; user?: User }> {
    try {
      const user = await this.getOrCreateUser(fid);
      if (!user) return { success: false };

      if (user.creditsRemaining < creditsToDeduct) {
        return { success: false };
      }

      user.creditsRemaining -= creditsToDeduct;
      this.users.set(fid, user);

      return { success: true, user };
    } catch (error) {
      console.error('Failed to deduct user credits:', error);
      return { success: false };
    }
  }

  async saveMemeForUser(fid: string, memeId: string): Promise<User | null> {
    try {
      const user = await this.getOrCreateUser(fid);
      if (!user) return null;

      if (!user.savedMemes.includes(memeId)) {
        user.savedMemes.push(memeId);
        this.users.set(fid, user);
      }

      return user;
    } catch (error) {
      console.error('Failed to save meme for user:', error);
      return null;
    }
  }

  async unsaveMemeForUser(fid: string, memeId: string): Promise<User | null> {
    try {
      const user = await this.getOrCreateUser(fid);
      if (!user) return null;

      user.savedMemes = user.savedMemes.filter(id => id !== memeId);
      this.users.set(fid, user);

      return user;
    } catch (error) {
      console.error('Failed to unsave meme for user:', error);
      return null;
    }
  }

  async updateUserPreferences(fid: string, preferences: Partial<User['preferences']>): Promise<User | null> {
    try {
      const user = await this.getOrCreateUser(fid);
      if (!user) return null;

      user.preferences = { ...user.preferences, ...preferences };
      this.users.set(fid, user);

      return user;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      return null;
    }
  }

  async unlockPackForUser(fid: string, packId: string): Promise<User | null> {
    try {
      const user = await this.getOrCreateUser(fid);
      if (!user) return null;

      // In a real implementation, this would grant access to pack memes
      // For now, just update user tier or add pack access
      if (user.tierType === 'free') {
        user.tierType = 'premium';
      }

      this.users.set(fid, user);
      return user;
    } catch (error) {
      console.error('Failed to unlock pack for user:', error);
      return null;
    }
  }

  // Get user's saved memes
  async getUserSavedMemes(fid: string): Promise<string[]> {
    try {
      const user = await this.getOrCreateUser(fid);
      return user?.savedMemes || [];
    } catch (error) {
      console.error('Failed to get user saved memes:', error);
      return [];
    }
  }

  // Check if user has access to premium features
  async hasPremiumAccess(fid: string): Promise<boolean> {
    try {
      const user = await this.getOrCreateUser(fid);
      return user?.tierType === 'premium' || (user?.creditsRemaining || 0) > 0;
    } catch (error) {
      console.error('Failed to check premium access:', error);
      return false;
    }
  }
}

export const userService = new UserService();

