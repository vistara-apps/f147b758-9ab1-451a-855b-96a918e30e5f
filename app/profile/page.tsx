'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Address } from '@coinbase/onchainkit/identity';
import { Settings2, Zap, Crown } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Your <span className="text-gradient">Profile</span>
          </h2>
          <p className="text-text-muted">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 rounded-lg mb-6">
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16" />
                <div className="flex-1">
                  <Name className="text-xl font-bold mb-1" />
                  <Address className="text-sm text-text-muted" />
                </div>
                <button className="p-2 hover:bg-surface-hover rounded-lg">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>
            </ConnectWallet>
          </Wallet>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold mb-1">0</p>
              <p className="text-sm text-text-muted">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1">0</p>
              <p className="text-sm text-text-muted">Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1">5</p>
              <p className="text-sm text-text-muted">Credits</p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="glass-card p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Free Tier</h3>
                <p className="text-sm text-text-muted">5 memes per day</p>
              </div>
            </div>
            <button className="btn-primary text-sm">
              Upgrade
            </button>
          </div>
          
          <div className="h-2 bg-surface rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-1/2" />
          </div>
          <p className="text-xs text-text-muted">2 of 5 daily credits used</p>
        </div>

        {/* Premium Benefits */}
        <div className="glass-card p-6 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-warning" />
            <h3 className="font-semibold">Premium Benefits</h3>
          </div>
          
          <ul className="space-y-3">
            {[
              'Unlimited meme access',
              'AI-powered caption generation',
              'Advanced analytics dashboard',
              'Priority support',
              'Early access to new features',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <span className="text-success">✓</span>
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>

          <button className="btn-primary w-full mt-6">
            Get Premium - 100 USDC
          </button>
        </div>

        {/* Connected Accounts */}
        <div className="glass-card p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Connected Accounts</h3>
          
          <div className="space-y-3">
            {[
              { name: 'Farcaster', connected: true },
              { name: 'Twitter', connected: false },
              { name: 'Instagram', connected: false },
              { name: 'LinkedIn', connected: false },
            ].map((account) => (
              <div key={account.name} className="flex items-center justify-between p-3 glass-card rounded-lg">
                <span className="text-sm font-medium">{account.name}</span>
                {account.connected ? (
                  <span className="text-xs text-success">Connected</span>
                ) : (
                  <button className="text-xs text-primary hover:underline">
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
