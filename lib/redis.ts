/**
 * Redis client for data persistence and caching
 */

import { Redis } from '@upstash/redis';
import { config } from './config';

// Initialize Redis client
export const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token,
});

/**
 * User data operations
 */
export class UserStore {
  private static readonly USER_PREFIX = 'user:';
  private static readonly CREDITS_PREFIX = 'credits:';
  private static readonly SAVED_MEMES_PREFIX = 'saved:';

  static async getUser(fid: string) {
    const key = `${this.USER_PREFIX}${fid}`;
    const userData = await redis.get(key);
    return userData ? JSON.parse(userData as string) : null;
  }

  static async createUser(fid: string, userData: any) {
    const key = `${this.USER_PREFIX}${fid}`;
    await redis.set(key, JSON.stringify({
      ...userData,
      fid,
      createdAt: new Date().toISOString(),
      creditsRemaining: 5, // Free tier
      tierType: 'free',
    }));
  }

  static async updateUser(fid: string, updates: Partial<any>) {
    const user = await this.getUser(fid);
    if (!user) throw new Error('User not found');

    const updatedUser = { ...user, ...updates };
    const key = `${this.USER_PREFIX}${fid}`;
    await redis.set(key, JSON.stringify(updatedUser));
    return updatedUser;
  }

  static async addCredits(fid: string, amount: number) {
    const creditsKey = `${this.CREDITS_PREFIX}${fid}`;
    const currentCredits = await redis.get(creditsKey) || 0;
    const newCredits = Number(currentCredits) + amount;
    await redis.set(creditsKey, newCredits);
    return newCredits;
  }

  static async getCredits(fid: string): Promise<number> {
    const creditsKey = `${this.CREDITS_PREFIX}${fid}`;
    const credits = await redis.get(creditsKey);
    return credits ? Number(credits) : 5; // Default free credits
  }

  static async saveMeme(fid: string, memeId: string) {
    const savedKey = `${this.SAVED_MEMES_PREFIX}${fid}`;
    const savedMemes = await redis.smembers(savedKey);
    if (!savedMemes.includes(memeId)) {
      await redis.sadd(savedKey, memeId);
    }
  }

  static async unsaveMeme(fid: string, memeId: string) {
    const savedKey = `${this.SAVED_MEMES_PREFIX}${fid}`;
    await redis.srem(savedKey, memeId);
  }

  static async getSavedMemes(fid: string): Promise<string[]> {
    const savedKey = `${this.SAVED_MEMES_PREFIX}${fid}`;
    return await redis.smembers(savedKey);
  }

  static async isMemeSaved(fid: string, memeId: string): Promise<boolean> {
    const savedKey = `${this.SAVED_MEMES_PREFIX}${fid}`;
    return await redis.sismember(savedKey, memeId);
  }
}

/**
 * Meme data operations
 */
export class MemeStore {
  private static readonly MEME_PREFIX = 'meme:';
  private static readonly TRENDING_PREFIX = 'trending:';

  static async saveMeme(meme: any) {
    const key = `${this.MEME_PREFIX}${meme.memeId}`;
    await redis.set(key, JSON.stringify(meme), { ex: 24 * 60 * 60 }); // 24 hours TTL
    return meme;
  }

  static async getMeme(memeId: string) {
    const key = `${this.MEME_PREFIX}${memeId}`;
    const memeData = await redis.get(key);
    return memeData ? JSON.parse(memeData as string) : null;
  }

  static async saveTrendingMemes(platform: string, memes: any[]) {
    const key = `${this.TRENDING_PREFIX}${platform}`;
    await redis.set(key, JSON.stringify(memes), { ex: 10 * 60 }); // 10 minutes TTL
  }

  static async getTrendingMemes(platform: string) {
    const key = `${this.TRENDING_PREFIX}${platform}`;
    const memesData = await redis.get(key);
    return memesData ? JSON.parse(memesData as string) : null;
  }
}

/**
 * Analytics operations
 */
export class AnalyticsStore {
  private static readonly ANALYTICS_PREFIX = 'analytics:';
  private static readonly EVENT_PREFIX = 'event:';

  static async logEvent(event: {
    eventId: string;
    userId: string;
    memeId: string;
    platform: string;
    action: 'view' | 'save' | 'post' | 'share';
    timestamp?: string;
  }) {
    const eventKey = `${this.EVENT_PREFIX}${event.eventId}`;
    const analyticsKey = `${this.ANALYTICS_PREFIX}${event.userId}:${event.memeId}`;

    // Store individual event
    await redis.set(eventKey, JSON.stringify({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    }), { ex: 30 * 24 * 60 * 60 }); // 30 days TTL

    // Update analytics summary
    const existing = await redis.get(analyticsKey);
    const analytics = existing ? JSON.parse(existing as string) : {
      userId: event.userId,
      memeId: event.memeId,
      views: 0,
      saves: 0,
      posts: 0,
      shares: 0,
      lastActivity: event.timestamp || new Date().toISOString(),
    };

    analytics[event.action + 's'] = (analytics[event.action + 's'] || 0) + 1;
    analytics.lastActivity = event.timestamp || new Date().toISOString();

    await redis.set(analyticsKey, JSON.stringify(analytics), { ex: 90 * 24 * 60 * 60 }); // 90 days TTL
  }

  static async getUserAnalytics(userId: string, days: number = 30) {
    const pattern = `${this.ANALYTICS_PREFIX}${userId}:*`;
    const keys = await redis.keys(pattern);

    const analytics = [];
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const parsed = JSON.parse(data as string);
        const lastActivity = new Date(parsed.lastActivity);
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        if (lastActivity >= cutoff) {
          analytics.push(parsed);
        }
      }
    }

    return analytics;
  }

  static async getMemeAnalytics(memeId: string) {
    const pattern = `${this.ANALYTICS_PREFIX}*:${memeId}`;
    const keys = await redis.keys(pattern);

    let totalViews = 0;
    let totalSaves = 0;
    let totalPosts = 0;
    let totalShares = 0;

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const parsed = JSON.parse(data as string);
        totalViews += parsed.views || 0;
        totalSaves += parsed.saves || 0;
        totalPosts += parsed.posts || 0;
        totalShares += parsed.shares || 0;
      }
    }

    return {
      memeId,
      totalViews,
      totalSaves,
      totalPosts,
      totalShares,
      totalEngagement: totalViews + totalSaves + totalPosts + totalShares,
    };
  }
}

/**
 * Cache operations
 */
export class CacheStore {
  private static readonly CACHE_PREFIX = 'cache:';

  static async get(key: string) {
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    const data = await redis.get(cacheKey);
    return data ? JSON.parse(data as string) : null;
  }

  static async set(key: string, data: any, ttlSeconds: number = 300) {
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    await redis.set(cacheKey, JSON.stringify(data), { ex: ttlSeconds });
  }

  static async delete(key: string) {
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    await redis.del(cacheKey);
  }

  static async clear(pattern: string = '*') {
    const keys = await redis.keys(`${this.CACHE_PREFIX}${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

