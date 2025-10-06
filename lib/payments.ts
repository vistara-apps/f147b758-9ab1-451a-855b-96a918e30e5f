/**
 * MiniKit payment integration for USDC transactions
 */

import { config } from './config';
import { UserStore } from './redis';

export interface PaymentRequest {
  amount: string; // Amount in USDC (e.g., "10")
  currency: 'USDC';
  recipient: string; // Contract address or recipient address
  reference?: string; // Optional reference for the transaction
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount?: string;
  error?: string;
}

/**
 * Process USDC payment using MiniKit
 */
export async function processPayment(
  fid: string,
  paymentRequest: PaymentRequest
): Promise<PaymentResult> {
  try {
    // Validate payment request
    if (!paymentRequest.amount || !paymentRequest.recipient) {
      throw new Error('Invalid payment request');
    }

    // Check if we're in a browser environment (MiniKit only works on client)
    if (typeof window === 'undefined') {
      throw new Error('Payments can only be processed on the client side');
    }

    // Import MiniKit dynamically to avoid SSR issues
    const { MiniKit } = await import('@coinbase/onchainkit');

    // Initialize MiniKit if needed
    // Note: MiniKit initialization should be done in the component

    // Process the payment
    const result = await MiniKit.pay({
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      recipient: paymentRequest.recipient,
      reference: paymentRequest.reference,
    });

    if (result.success) {
      // Update user credits based on payment amount
      const amount = parseFloat(paymentRequest.amount);
      let creditsToAdd = 0;

      if (amount === 10) {
        creditsToAdd = 1000; // 10 USDC = 1000 credits
      } else if (amount === 100) {
        creditsToAdd = 10000; // 100 USDC = 10000 credits (premium)
      }

      if (creditsToAdd > 0) {
        await UserStore.addCredits(fid, creditsToAdd);
      }

      return {
        success: true,
        transactionId: result.transactionId,
        amount: paymentRequest.amount,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Payment failed',
      };
    }
  } catch (error) {
    console.error('Payment processing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    };
  }
}

/**
 * Purchase credits with USDC
 */
export async function purchaseCredits(
  fid: string,
  creditPackage: 'basic' | 'premium'
): Promise<PaymentResult> {
  const packages = {
    basic: { amount: '10', credits: 1000 },
    premium: { amount: '100', credits: 10000 },
  };

  const pkg = packages[creditPackage];
  if (!pkg) {
    return {
      success: false,
      error: 'Invalid credit package',
    };
  }

  return await processPayment(fid, {
    amount: pkg.amount,
    currency: 'USDC',
    recipient: config.base.usdcContractAddress,
    reference: `credit-purchase-${creditPackage}-${Date.now()}`,
  });
}

/**
 * Purchase meme collection access
 */
export async function purchaseCollection(
  fid: string,
  collectionId: string
): Promise<PaymentResult> {
  // Collection prices (in USDC)
  const collectionPrices: Record<string, string> = {
    'crypto-pack': '10',
    'startup-pack': '10',
    'genz-pack': '10',
    'fitness-pack': '10',
    'dating-pack': '10',
  };

  const price = collectionPrices[collectionId];
  if (!price) {
    return {
      success: false,
      error: 'Invalid collection',
    };
  }

  return await processPayment(fid, {
    amount: price,
    currency: 'USDC',
    recipient: config.base.usdcContractAddress,
    reference: `collection-purchase-${collectionId}-${Date.now()}`,
  });
}

/**
 * Check if user can afford a purchase
 */
export async function canAffordPurchase(
  fid: string,
  amount: string
): Promise<boolean> {
  try {
    // Get user's wallet balance (this would need to be implemented)
    // For now, assume they can afford (MiniKit handles the actual balance check)
    return true;
  } catch (error) {
    console.error('Failed to check purchase affordability:', error);
    return false;
  }
}

/**
 * Get payment history for user
 */
export async function getPaymentHistory(fid: string) {
  // This would typically query a database or blockchain for transaction history
  // For now, return empty array
  return [];
}

/**
 * Validate transaction on-chain (after payment)
 */
export async function validateTransaction(transactionId: string): Promise<boolean> {
  try {
    // This would check the transaction status on Base network
    // For now, assume success
    return true;
  } catch (error) {
    console.error('Transaction validation failed:', error);
    return false;
  }
}

