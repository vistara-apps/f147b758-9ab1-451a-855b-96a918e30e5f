import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;

// Helper functions for data operations
export const redisHelpers = {
  // User operations
  async getUser(fid: string) {
    const user = await redis.get(`user:${fid}`);
    return user ? JSON.parse(user as string) : null;
  },

  async setUser(fid: string, userData: any) {
    await redis.set(`user:${fid}`, JSON.stringify(userData));
  },

  async updateUserCredits(fid: string, credits: number) {
    const user = await this.getUser(fid);
    if (user) {
      user.creditsRemaining = credits;
      await this.setUser(fid, user);
    }
  },

  // Meme operations
  async getMeme(memeId: string) {
    const meme = await redis.get(`meme:${memeId}`);
    return meme ? JSON.parse(meme as string) : null;
  },

  async setMeme(memeId: string, memeData: any) {
    await redis.set(`meme:${memeId}`, JSON.stringify(memeData));
  },

  async getMemesByTimeWindow(timeWindow: string) {
    const memeIds = await redis.smembers(`memes:timewindow:${timeWindow}`);
    const memes = [];
    for (const memeId of memeIds) {
      const meme = await this.getMeme(memeId);
      if (meme) memes.push(meme);
    }
    return memes.sort((a, b) => b.viralityScore - a.viralityScore);
  },

  async addMemeToTimeWindow(memeId: string, timeWindow: string) {
    await redis.sadd(`memes:timewindow:${timeWindow}`, memeId);
  },

  // Collection operations
  async getCollection(collectionId: string) {
    const collection = await redis.get(`collection:${collectionId}`);
    return collection ? JSON.parse(collection as string) : null;
  },

  async setCollection(collectionId: string, collectionData: any) {
    await redis.set(`collection:${collectionId}`, JSON.stringify(collectionData));
  },

  async getAllCollections() {
    const collectionIds = await redis.smembers('collections');
    const collections = [];
    for (const collectionId of collectionIds) {
      const collection = await this.getCollection(collectionId);
      if (collection) collections.push(collection);
    }
    return collections;
  },

  // Analytics operations
  async addAnalyticsEvent(event: any) {
    const eventId = `analytics:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await redis.set(eventId, JSON.stringify(event));
    await redis.sadd(`user:analytics:${event.userId}`, eventId);
  },

  async getUserAnalytics(userId: string) {
    const eventIds = await redis.smembers(`user:analytics:${userId}`);
    const events = [];
    for (const eventId of eventIds) {
      const event = await redis.get(eventId);
      if (event) events.push(JSON.parse(event as string));
    }
    return events;
  },

  // Cache operations
  async setCache(key: string, data: any, ttlSeconds: number = 300) {
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  },

  async getCache(key: string) {
    const data = await redis.get(key);
    return data ? JSON.parse(data as string) : null;
  }
};

