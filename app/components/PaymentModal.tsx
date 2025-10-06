'use client';

import { X, Zap, Package } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (type: 'credits' | 'pack', amount: number) => void;
}

export function PaymentModal({ isOpen, onClose, onPurchase }: PaymentModalProps) {
  if (!isOpen) return null;

  const options = [
    {
      type: 'credits' as const,
      title: '1000 Credits',
      description: 'Unlimited fresh memes for 30 days',
      price: 100,
      icon: Zap,
      popular: true,
    },
    {
      type: 'pack' as const,
      title: 'Premium Pack',
      description: '50 curated niche memes',
      price: 10,
      icon: Package,
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Buy Credits</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.type}
                className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                  option.popular
                    ? 'border-accent bg-accent/5'
                    : 'border-white/10 bg-surface hover:bg-surfaceHover'
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                      <p className="text-sm text-textMuted">{option.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient mb-2">
                      ${option.price}
                    </div>
                    <button
                      onClick={() => onPurchase(option.type, option.price)}
                      className="btn-primary text-sm"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Info */}
          <div className="p-4 bg-surface/50 rounded-lg border border-white/10">
            <p className="text-sm text-textMuted">
              💡 Payments are processed securely via Base network using USDC. 
              Transactions typically complete in under 5 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
