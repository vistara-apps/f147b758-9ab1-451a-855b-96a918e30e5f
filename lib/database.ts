import { redisHelpers } from './redis';
import { User, Meme, MemeCollection, AnalyticsEvent } from './types';

// User operations
export const userDB = {
  async createUser(fid: string, walletAddress: string): Promise<User> {
    const user: User = {
      fid,
      walletAddress,
      creditsRemaining: 5, // Free tier
      tierType: 'free',
      savedMemes: [],
      connectedAccounts: {},
      preferences: {
        niches: [],
        notificationSettings: true,
      },
    };

    await redisHelpers.setUser(fid, user);
    return user;
  },

  async getUser(fid: string): Promise<User | null> {
    return await redisHelpers.getUser(fid);
  },

  async updateUser(fid: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.getUser(fid);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    await redisHelpers.setUser(fid, updatedUser);
    return updatedUser;
  },

  async addCredits(fid: string, credits: number): Promise<User | null> {
    const user = await this.getUser(fid);
    if (!user) return null;

    user.creditsRemaining += credits;
    await redisHelpers.setUser(fid, user);
    return user;
  },

  async deductCredits(fid: string, credits: number): Promise<User | null> {
    const user = await this.getUser(fid);
    if (!user) return null;

    if (user.creditsRemaining < credits) {
      throw new Error('Insufficient credits');
    }

    user.creditsRemaining -= credits;
    await redisHelpers.setUser(fid, user);
    return user;
  },

  async saveMeme(fid: string, memeId: string): Promise<User | null> {
    const user = await this.getUser(fid);
    if (!user) return null;

    if (!user.savedMemes.includes(memeId)) {
      user.savedMemes.push(memeId);
      await redisHelpers.setUser(fid, user);
    }

    return user;
  },

  async unsaveMeme(fid: string, memeId: string): Promise<User | null> {
    const user = await this.getUser(fid);
    if (!user) return null;

    user.savedMemes = user.savedMemes.filter(id => id !== memeId);
    await redisHelpers.setUser(fid, user);
    return user;
  },
};

// Meme operations
export const memeDB = {
  async createMeme(memeData: Omit<Meme, 'memeId' | 'discoveredAt'>): Promise<Meme> {
    const memeId = `meme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const meme: Meme = {
      ...memeData,
      memeId,
      discoveredAt: new Date().toISOString(),
    };

    await redisHelpers.setMeme(memeId, meme);
    await redisHelpers.addMemeToTimeWindow(memeId, memeData.trendingTimeWindow);

    return meme;
  },

  async getMeme(memeId: string): Promise<Meme | null> {
    return await redisHelpers.getMeme(memeId);
  },

  async getMemesByTimeWindow(timeWindow: '1h' | '3h' | '6h'): Promise<Meme[]> {
    return await redisHelpers.getMemesByTimeWindow(timeWindow);
  },

  async getMemesByCategory(category: string): Promise<Meme[]> {
    // This would need a more sophisticated indexing in production
    // For now, we'll fetch all memes and filter
    const allTimeWindows = ['1h', '3h', '6h'];
    const allMemes: Meme[] = [];

    for (const timeWindow of allTimeWindows) {
      const memes = await this.getMemesByTimeWindow(timeWindow as any);
      allMemes.push(...memes);
    }

    return allMemes.filter(meme => meme.category === category);
  },

  async updateMemeVirality(memeId: string, newScore: number): Promise<Meme | null> {
    const meme = await this.getMeme(memeId);
    if (!meme) return null;

    meme.viralityScore = newScore;
    await redisHelpers.setMeme(memeId, meme);
    return meme;
  },
};

// Collection operations
export const collectionDB = {
  async createCollection(collectionData: Omit<MemeCollection, 'collectionId' | 'updatedAt'>): Promise<MemeCollection> {
    const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const collection: MemeCollection = {
      ...collectionData,
      collectionId,
      updatedAt: new Date().toISOString(),
    };

    await redisHelpers.setCollection(collectionId, collection);
    await redisHelpers.setCache(`collection:${collectionId}`, collection, 3600); // Cache for 1 hour

    return collection;
  },

  async getCollection(collectionId: string): Promise<MemeCollection | null> {
    // Try cache first
    let collection = await redisHelpers.getCache(`collection:${collectionId}`);
    if (!collection) {
      collection = await redisHelpers.getCollection(collectionId);
      if (collection) {
        await redisHelpers.setCache(`collection:${collectionId}`, collection, 3600);
      }
    }
    return collection;
  },

  async getAllCollections(): Promise<MemeCollection[]> {
    return await redisHelpers.getAllCollections();
  },

  async updateCollection(collectionId: string, updates: Partial<MemeCollection>): Promise<MemeCollection | null> {
    const collection = await this.getCollection(collectionId);
    if (!collection) return null;

    const updatedCollection = {
      ...collection,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await redisHelpers.setCollection(collectionId, updatedCollection);
    await redisHelpers.setCache(`collection:${collectionId}`, updatedCollection, 3600);

    return updatedCollection;
  },
};

// Analytics operations
export const analyticsDB = {
  async createEvent(eventData: Omit<AnalyticsEvent, 'eventId' | 'postedAt'>): Promise<AnalyticsEvent> {
    const event: AnalyticsEvent = {
      ...eventData,
      eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postedAt: new Date().toISOString(),
    };

    await redisHelpers.addAnalyticsEvent(event);
    return event;
  },

  async getUserAnalytics(userId: string): Promise<AnalyticsEvent[]> {
    return await redisHelpers.getUserAnalytics(userId);
  },

  async getAnalyticsSummary(userId: string): Promise<any> {
    const events = await this.getUserAnalytics(userId);

    const summary = {
      totalPosts: events.length,
      totalLikes: events.reduce((sum, event) => sum + event.likes, 0),
      totalShares: events.reduce((sum, event) => sum + event.shares, 0),
      totalComments: events.reduce((sum, event) => sum + event.comments, 0),
      platformBreakdown: {},
      categoryPerformance: {},
    };

    // Calculate platform breakdown
    events.forEach(event => {
      if (!summary.platformBreakdown[event.platform]) {
        summary.platformBreakdown[event.platform] = { posts: 0, engagement: 0 };
      }
      summary.platformBreakdown[event.platform].posts += 1;
      summary.platformBreakdown[event.platform].engagement +=
        event.likes + event.shares + event.comments;
    });

    return summary;
  },
};

