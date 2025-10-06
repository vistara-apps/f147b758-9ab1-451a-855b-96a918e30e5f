/**
 * Farcaster authentication utilities
 */

import { config } from './config';
import { UserStore } from './redis';

export interface FarcasterUser {
  fid: string;
  username?: string;
  displayName?: string;
  pfp?: string;
  bio?: string;
  verifiedAddresses?: {
    ethAddresses?: string[];
  };
}

/**
 * Get user from Farcaster MiniApp SDK
 */
export async function getFarcasterUser(): Promise<FarcasterUser | null> {
  try {
    // This would be called from the client side using the Farcaster MiniApp SDK
    // For now, return mock data for development
    if (typeof window === 'undefined') {
      return null; // Server-side
    }

    // In production, this would use the actual Farcaster SDK
    // const sdk = new MiniApp();
    // const user = await sdk.getUser();

    // Mock user for development
    return {
      fid: '12345',
      username: 'testuser',
      displayName: 'Test User',
      pfp: 'https://example.com/avatar.jpg',
      bio: 'Test user bio',
      verifiedAddresses: {
        ethAddresses: ['0x1234567890123456789012345678901234567890'],
      },
    };
  } catch (error) {
    console.error('Failed to get Farcaster user:', error);
    return null;
  }
}

/**
 * Authenticate user and create/update database record
 */
export async function authenticateUser(farcasterUser: FarcasterUser) {
  try {
    // Check if user exists
    let user = await UserStore.getUser(farcasterUser.fid);

    if (!user) {
      // Create new user
      const userData = {
        fid: farcasterUser.fid,
        username: farcasterUser.username,
        displayName: farcasterUser.displayName,
        pfp: farcasterUser.pfp,
        bio: farcasterUser.bio,
        walletAddress: farcasterUser.verifiedAddresses?.ethAddresses?.[0],
        connectedAccounts: {},
        preferences: {
          niches: ['crypto', 'genz'],
          notificationSettings: true,
        },
      };

      await UserStore.createUser(farcasterUser.fid, userData);
      user = await UserStore.getUser(farcasterUser.fid);
    } else {
      // Update existing user with latest info
      const updates = {
        username: farcasterUser.username,
        displayName: farcasterUser.displayName,
        pfp: farcasterUser.pfp,
        bio: farcasterUser.bio,
        walletAddress: farcasterUser.verifiedAddresses?.ethAddresses?.[0],
        lastLogin: new Date().toISOString(),
      };

      user = await UserStore.updateUser(farcasterUser.fid, updates);
    }

    return user;
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Get current user credits
 */
export async function getUserCredits(fid: string): Promise<number> {
  return await UserStore.getCredits(fid);
}

/**
 * Check if user has sufficient credits
 */
export async function hasCredits(fid: string, required: number = 1): Promise<boolean> {
  const credits = await getUserCredits(fid);
  return credits >= required;
}

/**
 * Deduct credits from user
 */
export async function deductCredits(fid: string, amount: number = 1): Promise<number> {
  const currentCredits = await getUserCredits(fid);
  if (currentCredits < amount) {
    throw new Error('Insufficient credits');
  }

  const newCredits = currentCredits - amount;
  await UserStore.addCredits(fid, -amount);
  return newCredits;
}

/**
 * Middleware to check authentication
 */
export async function requireAuth(fid: string | null): Promise<FarcasterUser> {
  if (!fid) {
    throw new Error('Authentication required');
  }

  const user = await UserStore.getUser(fid);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Generate session token (for future use)
 */
export function generateSessionToken(fid: string): string {
  // In production, use proper JWT or similar
  return Buffer.from(`${fid}:${Date.now()}`).toString('base64');
}

/**
 * Validate session token
 */
export function validateSessionToken(token: string): { fid: string; timestamp: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [fid, timestamp] = decoded.split(':');
    return {
      fid,
      timestamp: parseInt(timestamp),
    };
  } catch {
    return null;
  }
}

