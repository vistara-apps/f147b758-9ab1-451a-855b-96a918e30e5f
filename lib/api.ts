/**
 * API client utilities for external service integrations
 */

import { config } from './config';

// Generic API client with error handling and retries
export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Reddit API client
export const redditClient = new ApiClient(config.apis.reddit.baseUrl, {
  'User-Agent': 'MemeFlow/1.0',
});

// Twitter API client
export const twitterClient = new ApiClient(config.apis.twitter.baseUrl, {
  'Authorization': `Bearer ${config.apis.twitter.bearerToken}`,
});

// Giphy API client
export const giphyClient = new ApiClient(config.apis.giphy.baseUrl);

// OpenAI API client
export const openaiClient = new ApiClient(config.apis.openai.baseUrl, {
  'Authorization': `Bearer ${config.apis.openai.apiKey}`,
});

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  canMakeRequest(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Cache utility for API responses
 */
export class ApiCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttlMs: number;

  constructor(ttlMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.ttlMs = ttlMs;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

