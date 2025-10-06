'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { Menu, Search, Bell } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-surface-hover rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gradient">MemeFlow</h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-surface-hover rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button className="p-2 hover:bg-surface-hover rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>

            <Wallet>
              <ConnectWallet>
                <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
                  <Avatar className="w-6 h-6" />
                  <Name className="text-sm" />
                </div>
              </ConnectWallet>
            </Wallet>
          </div>
        </div>

        {showSearch && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search memes..."
              className="w-full glass-card px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>
    </header>
  );
}
