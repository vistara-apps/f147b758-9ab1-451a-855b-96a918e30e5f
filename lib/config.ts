/**
 * Application configuration
 * Centralizes all environment variables and API configurations
 */

export const config = {
  // Coinbase OnchainKit
  onchainkit: {
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  },

  // Farcaster
  farcaster: {
    appFid: process.env.NEXT_PUBLIC_FARCASTER_APP_FID,
  },

  // External APIs
  apis: {
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      baseUrl: 'https://www.reddit.com',
    },
    twitter: {
      bearerToken: process.env.TWITTER_BEARER_TOKEN,
      baseUrl: 'https://api.twitter.com/2',
    },
    giphy: {
      apiKey: process.env.GIPHY_API_KEY,
      baseUrl: 'https://api.giphy.com/v1',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1',
    },
  },

  // Database
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },

  // Base Network
  base: {
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    usdcContractAddress: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  },
};

/**
 * Validate required environment variables
 */
export function validateConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
    'REDDIT_CLIENT_ID',
    'REDDIT_CLIENT_SECRET',
    'TWITTER_BEARER_TOKEN',
    'GIPHY_API_KEY',
    'OPENAI_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all API keys are configured.'
    );
  }
}

/**
 * Check if we're in production
 */
export const isProduction = config.app.environment === 'production';

/**
 * Check if we're in development
 */
export const isDevelopment = config.app.environment === 'development';

