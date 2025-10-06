/**
 * OpenAI API integration for meme caption generation
 */

import { openaiClient, rateLimiter } from './api';
import type { Meme } from './types';

const RATE_LIMIT_KEY = 'openai-api';
const RATE_LIMIT_REQUESTS = 50; // OpenAI allows various limits, be conservative
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export interface CaptionGenerationRequest {
  meme: Meme;
  style?: 'funny' | 'serious' | 'viral' | 'trendy';
  platform?: 'farcaster' | 'twitter' | 'linkedin';
  maxLength?: number;
}

export interface CaptionResponse {
  success: boolean;
  captions?: string[];
  error?: string;
}

/**
 * Generate AI-powered captions for a meme
 */
export async function generateCaptions(
  request: CaptionGenerationRequest
): Promise<CaptionResponse> {
  try {
    // Check rate limit
    if (!rateLimiter.canMakeRequest(RATE_LIMIT_KEY, RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW)) {
      throw new Error('Rate limit exceeded for OpenAI API');
    }

    const { meme, style = 'funny', platform = 'farcaster', maxLength = 280 } = request;

    // Create prompt for caption generation
    const prompt = `Generate 3 creative and engaging captions for this meme image.

Meme details:
- Platform: ${meme.platform}
- Category: ${meme.category}
- Current caption suggestions: ${meme.captionSuggestions.join(', ')}

Style: ${style}
Target platform: ${platform}
Max length: ${maxLength} characters

Requirements:
- Make them ${style} and engaging
- Optimized for ${platform} audience
- Include relevant emojis
- Keep under ${maxLength} characters
- Make them shareable and viral

Return only the 3 captions, one per line, no additional text.`;

    const response = await openaiClient.post('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: meme.imageUrl,
                detail: 'low', // Use low detail for faster processing
              },
            },
          ],
        },
      ],
      max_tokens: 200,
      temperature: 0.8, // Creative but not too random
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No captions generated');
    }

    const content = response.choices[0].message.content;
    const captions = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= maxLength)
      .slice(0, 3); // Ensure we get exactly 3 captions

    if (captions.length === 0) {
      throw new Error('Failed to parse generated captions');
    }

    return {
      success: true,
      captions,
    };
  } catch (error) {
    console.error('Failed to generate captions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Caption generation failed',
    };
  }
}

/**
 * Generate a single optimized caption for posting
 */
export async function generateSingleCaption(
  meme: Meme,
  platform: 'farcaster' | 'twitter' | 'linkedin' = 'farcaster'
): Promise<string> {
  const result = await generateCaptions({
    meme,
    platform,
    maxLength: platform === 'twitter' ? 280 : 500,
  });

  if (!result.success || !result.captions || result.captions.length === 0) {
    // Fallback to existing suggestions
    return meme.captionSuggestions[0];
  }

  return result.captions[0];
}

/**
 * Analyze meme content for better categorization
 */
export async function analyzeMemeContent(meme: Meme): Promise<{
  category: Meme['category'];
  tags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}> {
  try {
    // Check rate limit
    if (!rateLimiter.canMakeRequest(RATE_LIMIT_KEY, RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW)) {
      return {
        category: meme.category,
        tags: [],
        sentiment: 'neutral',
      };
    }

    const prompt = `Analyze this meme image and provide:
1. Best category (crypto, startup, fitness, genz, dating)
2. Relevant tags (comma-separated)
3. Sentiment (positive, negative, neutral)

Return in JSON format: {"category": "genz", "tags": ["funny", "relatable"], "sentiment": "positive"}`;

    const response = await openaiClient.post('/chat/completions', {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: meme.imageUrl,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const analysis = JSON.parse(content);

    return {
      category: analysis.category || meme.category,
      tags: analysis.tags || [],
      sentiment: analysis.sentiment || 'neutral',
    };
  } catch (error) {
    console.error('Failed to analyze meme content:', error);
    return {
      category: meme.category,
      tags: [],
      sentiment: 'neutral',
    };
  }
}

/**
 * Generate viral potential score for a meme
 */
export async function calculateViralPotential(meme: Meme): Promise<number> {
  try {
    // Check rate limit
    if (!rateLimiter.canMakeRequest(RATE_LIMIT_KEY, RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW)) {
      return meme.viralityScore;
    }

    const prompt = `Rate this meme's viral potential on a scale of 0-100 based on:
- Humor level
- Relatability
- Shareability
- Timeliness
- Visual appeal

Return only a number between 0-100.`;

    const response = await openaiClient.post('/chat/completions', {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: meme.imageUrl,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 10,
      temperature: 0.2,
    });

    const score = parseInt(response.choices[0].message.content.trim());
    return isNaN(score) ? meme.viralityScore : Math.max(0, Math.min(100, score));
  } catch (error) {
    console.error('Failed to calculate viral potential:', error);
    return meme.viralityScore;
  }
}

