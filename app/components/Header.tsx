'use client';

import { Menu, Zap } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useState } from 'react';

interface HeaderProps {
  credits: number;
  onBuyCredits: () => void;
}

export function Header({ credits, onBuyCredits }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-surface rounded-lg transition-colors duration-200 lg:hidden"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gradient">MemeFlow</h1>
          </div>

          {/* Credits & Wallet */}
          <div className="flex items-center gap-3">
            {/* Credits Display */}
            <button
              onClick={onBuyCredits}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface hover:bg-surfaceHover transition-all duration-200 border border-white/10"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">{credits}</span>
            </button>

            {/* Wallet Connect */}
            <Wallet>
              <ConnectWallet>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                  <Avatar className="w-6 h-6" />
                  <Name className="text-sm font-medium" />
                </div>
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </div>
    </header>
  );
}
