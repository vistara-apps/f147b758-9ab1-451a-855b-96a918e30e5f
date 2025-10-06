'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Package } from 'lucide-react';
import { usePayments } from '@/lib/hooks/usePayments';
import { useAuth } from './AuthProvider';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedOption, setSelectedOption] = useState<'credits' | 'pack' | null>(null);
  const { purchaseCredits, purchasePack, isProcessing } = usePayments();
  const { user } = useAuth();

  const handlePurchase = async () => {
    if (!user || !selectedOption) return;

    try {
      if (selectedOption === 'credits') {
        await purchaseCredits(user.fid, 100, 'credit_purchase_100');
      } else if (selectedOption === 'pack') {
        await purchasePack(user.fid, 'crypto-pack'); // Default to crypto pack
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card
            className={`cursor-pointer transition-colors ${
              selectedOption === 'credits' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedOption('credits')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <CardTitle className="text-lg">1000 Credits</CardTitle>
              </div>
              <CardDescription>
                Unlimited meme access for 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100 USDC</div>
              <div className="text-sm text-muted-foreground">
                ~$100 worth of credits
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              selectedOption === 'pack' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedOption('pack')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <CardTitle className="text-lg">Crypto Memes Pack</CardTitle>
              </div>
              <CardDescription>
                50 curated crypto memes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10 USDC</div>
              <div className="text-sm text-muted-foreground">
                One-time purchase
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!selectedOption || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Pay with Base Wallet'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

