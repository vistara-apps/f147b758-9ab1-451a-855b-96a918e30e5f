/**
 * Farcaster Hub API integration for posting casts
 */

import { config } from './config';
import { deductCredits } from './auth';
import type { Meme } from './types';

export interface CastRequest {
  text: string;
  embeds?: Array<{
    url: string;
    title?: string;
  }>;
  parentUrl?: string; // For replies
}

export interface CastResponse {
  success: boolean;
  cast?: {
    hash: string;
    fid: number;
    text: string;
    timestamp: number;
  };
  error?: string;
}

/**
 * Post a cast to Farcaster
 */
export async function postCast(
  fid: string,
  castRequest: CastRequest
): Promise<CastResponse> {
  try {
    // Deduct credits before posting
    await deductCredits(fid, 1);

    // In production, this would use the Farcaster Hub API
    // For now, simulate the API call

    const response = await fetch(`${config.apis.farcaster.baseUrl}/v1/casts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers as needed
      },
      body: JSON.stringify({
        fid: parseInt(fid),
        text: castRequest.text,
        embeds: castRequest.embeds,
        parentUrl: castRequest.parentUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Farcaster API error: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      cast: {
        hash: result.cast.hash,
        fid: result.cast.fid,
        text: result.cast.text,
        timestamp: result.cast.timestamp,
      },
    };
  } catch (error) {
    console.error('Failed to post cast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post cast',
    };
  }
}

/**
 * Post a meme as a cast
 */
export async function postMemeCast(
  fid: string,
  meme: Meme,
  customCaption?: string
): Promise<CastResponse> {
  const caption = customCaption || meme.captionSuggestions[0];

  const castRequest: CastRequest = {
    text: caption,
    embeds: [
      {
        url: meme.imageUrl,
        title: `Meme from ${meme.platform}`,
      },
    ],
  };

  return await postCast(fid, castRequest);
}

/**
 * Get user profile information
 */
export async function getUserProfile(fid: string) {
  try {
    const response = await fetch(`${config.apis.farcaster.baseUrl}/v1/user?fid=${fid}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
}

/**
 * Get casts by FID
 */
export async function getUserCasts(fid: string, limit: number = 10) {
  try {
    const response = await fetch(
      `${config.apis.farcaster.baseUrl}/v1/casts?fid=${fid}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user casts: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get user casts:', error);
    throw error;
  }
}

/**
 * Search casts by keyword
 */
export async function searchCasts(query: string, limit: number = 20) {
  try {
    const response = await fetch(
      `${config.apis.farcaster.baseUrl}/v1/casts/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search casts: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to search casts:', error);
    throw error;
  }
}

/**
 * Follow a user
 */
export async function followUser(fid: string, targetFid: string): Promise<boolean> {
  try {
    const response = await fetch(`${config.apis.farcaster.baseUrl}/v1/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fid: parseInt(fid),
        targetFid: parseInt(targetFid),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to follow user:', error);
    return false;
  }
}

/**
 * Get follower count
 */
export async function getFollowerCount(fid: string): Promise<number> {
  try {
    const response = await fetch(`${config.apis.farcaster.baseUrl}/v1/followers/count?fid=${fid}`);

    if (!response.ok) {
      throw new Error(`Failed to get follower count: ${response.status}`);
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Failed to get follower count:', error);
    return 0;
  }
}

