import { miniKitService } from './minikit';
import type { User } from './types';

export interface PaymentIntent {
  type: 'credits' | 'pack';
  amount: string; // USDC amount
  credits?: number; // Credits to add (for credit purchases)
  packId?: string; // Pack ID (for pack purchases)
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  creditsAdded?: number;
  packUnlocked?: string;
  error?: string;
}

export class PaymentService {
  // Credit packages
  private readonly creditPackages = {
    small: { amount: '10', credits: 100 },
    medium: { amount: '50', credits: 500 },
    large: { amount: '100', credits: 1000 },
  };

  // Pack prices
  private readonly packPrices = {
    'crypto-pack': '10',
    'startup-pack': '10',
    'fitness-pack': '10',
    'genz-pack': '10',
    'dating-pack': '10',
  };

  async processPayment(intent: PaymentIntent): Promise<PaymentResult> {
    try {
      let result;

      if (intent.type === 'credits') {
        result = await miniKitService.payForCredits(intent.amount);
      } else if (intent.type === 'pack') {
        if (!intent.packId) {
          return { success: false, error: 'Pack ID required for pack purchase' };
        }
        const packAmount = this.packPrices[intent.packId as keyof typeof this.packPrices];
        if (!packAmount) {
          return { success: false, error: 'Invalid pack ID' };
        }
        result = await miniKitService.payForPack(intent.packId, packAmount);
      } else {
        return { success: false, error: 'Invalid payment type' };
      }

      if (!result.success) {
        return result;
      }

      // Process successful payment
      const processedResult = await this.processSuccessfulPayment(intent, result.transactionHash!);

      return processedResult;
    } catch (error: any) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  private async processSuccessfulPayment(intent: PaymentIntent, transactionHash: string): Promise<PaymentResult> {
    // In a real implementation, this would:
    // 1. Verify the transaction on-chain
    // 2. Update user's credits/packs in database
    // 3. Send confirmation notifications

    if (intent.type === 'credits') {
      const creditsToAdd = this.calculateCreditsFromAmount(intent.amount);
      return {
        success: true,
        transactionHash,
        creditsAdded: creditsToAdd,
      };
    } else if (intent.type === 'pack') {
      return {
        success: true,
        transactionHash,
        packUnlocked: intent.packId,
      };
    }

    return { success: false, error: 'Unknown payment intent type' };
  }

  private calculateCreditsFromAmount(amount: string): number {
    const usdAmount = parseFloat(amount);

    // Simple calculation: 1 USDC = 10 credits
    // But with bonuses for larger purchases
    let credits = usdAmount * 10;

    if (usdAmount >= 100) credits *= 1.2; // 20% bonus for 100+ USDC
    else if (usdAmount >= 50) credits *= 1.1; // 10% bonus for 50+ USDC

    return Math.floor(credits);
  }

  getCreditPackages() {
    return this.creditPackages;
  }

  getPackPrice(packId: string): string | null {
    return this.packPrices[packId as keyof typeof this.packPrices] || null;
  }

  // Simulate credit deduction (in real app, this would update database)
  async deductCredits(userId: string, amount: number): Promise<boolean> {
    // Mock implementation - in real app, check and update user credits
    console.log(`Deducting ${amount} credits from user ${userId}`);
    return true;
  }

  // Check if user has enough credits
  async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    // Mock implementation - in real app, check user credits from database
    console.log(`Checking if user ${userId} has ${required} credits`);
    return true; // Assume they have credits for demo
  }
}

export const paymentService = new PaymentService();

