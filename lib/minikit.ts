import { MiniKit } from '@coinbase/onchainkit';

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface PaymentOptions {
  amount: string; // Amount in USDC (e.g., "10")
  currency: 'USDC';
  recipient: string; // Contract address or recipient address
}

export class MiniKitService {
  async pay(options: PaymentOptions): Promise<PaymentResult> {
    try {
      // Check if MiniKit is available (running in Base MiniApp context)
      if (typeof window === 'undefined' || !window.MiniKit) {
        return {
          success: false,
          error: 'MiniKit not available - must be running in Base MiniApp context',
        };
      }

      const result = await MiniKit.pay({
        amount: options.amount,
        currency: options.currency,
        recipient: options.recipient,
      });

      if (result.success) {
        return {
          success: true,
          transactionHash: result.transactionHash,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Payment failed',
        };
      }
    } catch (error: any) {
      console.error('MiniKit payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }
  }

  async payForCredits(amount: string): Promise<PaymentResult> {
    // Contract address for credit purchases
    const creditContractAddress = process.env.CREDIT_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';

    return this.pay({
      amount,
      currency: 'USDC',
      recipient: creditContractAddress,
    });
  }

  async payForPack(packId: string, amount: string): Promise<PaymentResult> {
    // Contract address for pack purchases
    const packContractAddress = process.env.PACK_CONTRACT_ADDRESS || '0x0987654321098765432109876543210987654321';

    return this.pay({
      amount,
      currency: 'USDC',
      recipient: packContractAddress,
    });
  }

  // Utility function to check if running in MiniApp context
  isMiniAppContext(): boolean {
    return typeof window !== 'undefined' && !!window.MiniKit;
  }

  // Get user's wallet address from MiniKit
  async getWalletAddress(): Promise<string | null> {
    try {
      if (!this.isMiniAppContext()) return null;

      const walletInfo = await MiniKit.getWalletAddress();
      return walletInfo.address || null;
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      return null;
    }
  }
}

export const miniKitService = new MiniKitService();

