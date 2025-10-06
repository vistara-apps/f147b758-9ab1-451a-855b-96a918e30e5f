import { redditAPI } from './api/reddit';
import { twitterAPI } from './api/twitter';
import { giphyAPI } from './api/giphy';
import { openaiAPI } from './api/openai';
import type { Meme, TimeWindow, Category } from './types';

export class MemeService {
  async getTrendingMemes(
    timeWindow: TimeWindow = '1h',
    category?: Category,
    limit: number = 50
  ): Promise<Meme[]> {
    try {
      // Fetch memes from all sources in parallel
      const [redditMemes, twitterMemes, giphyMemes] = await Promise.allSettled([
        redditAPI.getTrendingMemes(),
        twitterAPI.getTrendingMemes(this.timeWindowToHours(timeWindow)),
        giphyAPI.getTrendingMemes(25),
      ]);

      // Combine and filter results
      const allMemes: Meme[] = [];

      if (redditMemes.status === 'fulfilled') {
        allMemes.push(...redditMemes.value);
      }

      if (twitterMemes.status === 'fulfilled') {
        allMemes.push(...twitterMemes.value);
      }

      if (giphyMemes.status === 'fulfilled') {
        allMemes.push(...giphyMemes.value);
      }

      // Filter by time window and category
      let filteredMemes = allMemes.filter(meme => meme.trendingTimeWindow === timeWindow);

      if (category && category !== 'all') {
        filteredMemes = filteredMemes.filter(meme => meme.category === category);
      }

      // Sort by virality score and limit results
      return filteredMemes
        .sort((a, b) => b.viralityScore - a.viralityScore)
        .slice(0, limit);

    } catch (error) {
      console.error('Failed to fetch trending memes:', error);
      return [];
    }
  }

  async getMemeById(memeId: string): Promise<Meme | null> {
    // In a real implementation, this would fetch from cache/database
    // For now, return null as we don't have persistent storage
    return null;
  }

  async enhanceMemeCaptions(meme: Meme): Promise<Meme> {
    try {
      // Use OpenAI to generate better captions based on the image
      const aiCaptions = await openaiAPI.generateCaptions(
        meme.imageUrl,
        `This is a ${meme.category} meme from ${meme.platform}`,
        meme.category
      );

      if (aiCaptions.length > 0) {
        // Combine existing captions with AI-generated ones
        const combinedCaptions = [
          ...meme.captionSuggestions.slice(0, 2), // Keep first 2 original
          ...aiCaptions.slice(0, 3), // Add up to 3 AI-generated
        ];

        return {
          ...meme,
          captionSuggestions: [...new Set(combinedCaptions)], // Remove duplicates
        };
      }

      return meme;
    } catch (error) {
      console.error('Failed to enhance meme captions:', error);
      return meme;
    }
  }

  async searchMemes(query: string, category?: Category, limit: number = 20): Promise<Meme[]> {
    try {
      // Search Giphy for relevant GIFs
      const giphyResults = await giphyAPI.searchMemes(query, limit);

      let filteredResults = giphyResults;

      if (category && category !== 'all') {
        filteredResults = filteredResults.filter(meme => meme.category === category);
      }

      return filteredResults.slice(0, limit);
    } catch (error) {
      console.error('Failed to search memes:', error);
      return [];
    }
  }

  async getMemeCollections(): Promise<any[]> {
    // In a real implementation, this would fetch from database
    // For now, return mock collections
    return [
      {
        collectionId: 'crypto-pack',
        name: 'Crypto Memes Pack',
        niche: 'crypto',
        priceUsdc: 10,
        memeCount: 50,
        updatedAt: new Date().toISOString(),
      },
      {
        collectionId: 'startup-pack',
        name: 'Startup Memes Pack',
        niche: 'startup',
        priceUsdc: 10,
        memeCount: 50,
        updatedAt: new Date().toISOString(),
      },
      {
        collectionId: 'genz-pack',
        name: 'Gen Z Memes Pack',
        niche: 'genz',
        priceUsdc: 10,
        memeCount: 50,
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private timeWindowToHours(timeWindow: TimeWindow): number {
    switch (timeWindow) {
      case '1h': return 1;
      case '3h': return 3;
      case '6h': return 6;
      default: return 1;
    }
  }
}

export const memeService = new MemeService();

