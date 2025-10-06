'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, CheckCircle } from 'lucide-react';
import { useMiniKit } from './MiniKitProvider';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (credits: number) => void;
  type: 'credits' | 'collection';
  collectionPrice?: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  type,
  collectionPrice,
}: PaymentModalProps) {
  const { isConnected, connect } = useMiniKit();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePayment = async (amount: string, credits: number) => {
    if (!isConnected) {
      await connect();
      return;
    }

    setProcessing(true);
    try {
      // In a real implementation, this would call MiniKit.pay()
      // For now, we'll simulate the payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCompleted(true);
      setTimeout(() => {
        onPaymentSuccess(credits);
        onClose();
        setCompleted(false);
      }, 1500);

    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const renderCreditsOptions = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Choose Your Plan</h3>
        <p className="text-text-muted">Get unlimited access to fresh memes</p>
      </div>

      <div className="grid gap-3">
        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">1000 Credits</span>
            </div>
            <Badge variant="outline">Popular</Badge>
          </div>
          <p className="text-sm text-text-muted mb-3">
            100 USDC • 30 days unlimited access
          </p>
          <Button
            onClick={() => handlePayment('100', 1000)}
            disabled={processing || completed}
            className="w-full"
          >
            {processing ? 'Processing...' : completed ? 'Success!' : 'Buy 1000 Credits'}
          </Button>
        </div>

        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-500" />
              <span className="font-medium">500 Credits</span>
            </div>
            <Badge variant="secondary">Basic</Badge>
          </div>
          <p className="text-sm text-text-muted mb-3">
            50 USDC • 15 days access
          </p>
          <Button
            onClick={() => handlePayment('50', 500)}
            disabled={processing || completed}
            variant="outline"
            className="w-full"
          >
            {processing ? 'Processing...' : completed ? 'Success!' : 'Buy 500 Credits'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCollectionUnlock = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unlock Premium Collection</h3>
        <p className="text-text-muted">
          Get access to 50+ curated memes updated weekly
        </p>
      </div>

      <div className="bg-surface rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-xl font-bold">{collectionPrice} USDC</span>
        </div>
        <p className="text-sm text-text-muted">One-time payment</p>
      </div>

      <Button
        onClick={() => handlePayment(collectionPrice?.toString() || '10', 0)}
        disabled={processing || completed}
        className="w-full"
        size="lg"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : completed ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Collection Unlocked!
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay {collectionPrice} USDC
          </>
        )}
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'credits' ? 'Buy Credits' : 'Unlock Collection'}
          </DialogTitle>
        </DialogHeader>

        {!isConnected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-text-muted mb-6">
              Connect your Base wallet to make payments
            </p>
            <Button onClick={connect} className="w-full">
              Connect Wallet
            </Button>
          </div>
        ) : type === 'credits' ? (
          renderCreditsOptions()
        ) : (
          renderCollectionUnlock()
        )}
      </DialogContent>
    </Dialog>
  );
}

