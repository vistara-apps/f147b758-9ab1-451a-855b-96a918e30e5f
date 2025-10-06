import { MiniKit } from '@coinbase/onchainkit';

export class MiniKitService {
  static async payWithUSDC(amount: string, recipient: string): Promise<any> {
    try {
      const result = await MiniKit.pay({
        amount,
        currency: 'USDC',
        recipient,
      });

      return result;
    } catch (error) {
      console.error('MiniKit payment error:', error);
      throw error;
    }
  }

  static async connectWallet(): Promise<any> {
    try {
      const result = await MiniKit.connectWallet();
      return result;
    } catch (error) {
      console.error('MiniKit wallet connection error:', error);
      throw error;
    }
  }

  static async getWalletAddress(): Promise<string | null> {
    try {
      const wallet = await MiniKit.getWalletAddress();
      return wallet;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  }

  static async signMessage(message: string): Promise<any> {
    try {
      const result = await MiniKit.signMessage(message);
      return result;
    } catch (error) {
      console.error('MiniKit sign message error:', error);
      throw error;
    }
  }

  static async verifySignature(message: string, signature: string): Promise<boolean> {
    try {
      const result = await MiniKit.verifySignature(message, signature);
      return result;
    } catch (error) {
      console.error('MiniKit verify signature error:', error);
      return false;
    }
  }
}

// Frame action handlers
export const frameActions = {
  save_meme: async (memeId: string, fid: string) => {
    // Implementation will be in the frame route
    return { success: true, action: 'save_meme', memeId, fid };
  },

  post_now: async (memeId: string, fid: string) => {
    // Implementation will be in the frame route
    return { success: true, action: 'post_now', memeId, fid };
  },

  buy_credits: async (amount: string, fid: string) => {
    // Implementation will be in the frame route
    return { success: true, action: 'buy_credits', amount, fid };
  },

  share_feed: async (fid: string) => {
    // Implementation will be in the frame route
    return { success: true, action: 'share_feed', fid };
  },
};

