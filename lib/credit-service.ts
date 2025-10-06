import { userService } from './user-service';
import type { User } from './types';

export interface CreditTransaction {
  type: 'earn' | 'spend' | 'purchase';
  amount: number;
  reason: string;
  timestamp: string;
}

export class CreditService {
  private readonly DAILY_FREE_CREDITS = 5;
  private readonly PREMIUM_MULTIPLIER = 2; // Premium users get 2x credits

  async getUserCredits(fid: string): Promise<number> {
    try {
      const user = await userService.getOrCreateUser(fid);
      return user?.creditsRemaining || 0;
    } catch (error) {
      console.error('Failed to get user credits:', error);
      return 0;
    }
  }

  async spendCredits(fid: string, amount: number, reason: string = 'Meme posting'): Promise<{ success: boolean; remainingCredits?: number }> {
    try {
      const result = await userService.deductUserCredits(fid, amount);

      if (result.success && result.user) {
        // Log the transaction (in real app, save to database)
        this.logTransaction(fid, {
          type: 'spend',
          amount: -amount,
          reason,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          remainingCredits: result.user.creditsRemaining,
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Failed to spend credits:', error);
      return { success: false };
    }
  }

  async addCredits(fid: string, amount: number, reason: string = 'Credit purchase'): Promise<{ success: boolean; newTotal?: number }> {
    try {
      const user = await userService.updateUserCredits(fid, amount);

      if (user) {
        // Log the transaction
        this.logTransaction(fid, {
          type: 'earn',
          amount,
          reason,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          newTotal: user.creditsRemaining,
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Failed to add credits:', error);
      return { success: false };
    }
  }

  async checkCreditsForAction(fid: string, requiredCredits: number = 1): Promise<{ hasEnough: boolean; currentCredits: number }> {
    try {
      const currentCredits = await this.getUserCredits(fid);
      return {
        hasEnough: currentCredits >= requiredCredits,
        currentCredits,
      };
    } catch (error) {
      console.error('Failed to check credits:', error);
      return { hasEnough: false, currentCredits: 0 };
    }
  }

  async resetDailyCredits(fid: string): Promise<boolean> {
    try {
      const user = await userService.getOrCreateUser(fid);
      if (!user) return false;

      // Reset to daily free credits
      const resetAmount = this.DAILY_FREE_CREDITS - user.creditsRemaining;
      if (resetAmount > 0) {
        await userService.updateUserCredits(fid, resetAmount);
      }

      return true;
    } catch (error) {
      console.error('Failed to reset daily credits:', error);
      return false;
    }
  }

  async grantPremiumCredits(fid: string): Promise<boolean> {
    try {
      const user = await userService.getOrCreateUser(fid);
      if (!user || user.tierType !== 'premium') return false;

      // Premium users get bonus credits
      const bonusCredits = this.DAILY_FREE_CREDITS * (this.PREMIUM_MULTIPLIER - 1);
      await userService.updateUserCredits(fid, bonusCredits);

      return true;
    } catch (error) {
      console.error('Failed to grant premium credits:', error);
      return false;
    }
  }

  getCreditPackages() {
    return {
      small: { usdAmount: 10, credits: 100, bonus: 0 },
      medium: { usdAmount: 50, credits: 500, bonus: 50 }, // 10% bonus
      large: { usdAmount: 100, credits: 1000, bonus: 200 }, // 20% bonus
    };
  }

  calculateCreditsFromUSD(usdAmount: number): number {
    // Base rate: 10 credits per USD
    let credits = usdAmount * 10;

    // Apply bonuses
    if (usdAmount >= 100) {
      credits += usdAmount * 2; // 20% bonus
    } else if (usdAmount >= 50) {
      credits += usdAmount * 1; // 10% bonus
    }

    return Math.floor(credits);
  }

  private logTransaction(fid: string, transaction: CreditTransaction): void {
    // In a real implementation, save to database
    console.log(`Credit transaction for user ${fid}:`, transaction);
  }

  // Analytics methods
  async getCreditStats(fid: string): Promise<{
    currentCredits: number;
    totalEarned: number;
    totalSpent: number;
    tierType: string;
  }> {
    try {
      const user = await userService.getOrCreateUser(fid);
      if (!user) {
        return {
          currentCredits: 0,
          totalEarned: 0,
          totalSpent: 0,
          tierType: 'free',
        };
      }

      // In a real implementation, calculate from transaction history
      return {
        currentCredits: user.creditsRemaining,
        totalEarned: user.tierType === 'premium' ? 1000 : 0, // Mock data
        totalSpent: Math.max(0, (user.tierType === 'premium' ? 1000 : 5) - user.creditsRemaining),
        tierType: user.tierType,
      };
    } catch (error) {
      console.error('Failed to get credit stats:', error);
      return {
        currentCredits: 0,
        totalEarned: 0,
        totalSpent: 0,
        tierType: 'free',
      };
    }
  }
}

export const creditService = new CreditService();

