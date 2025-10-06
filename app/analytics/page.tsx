'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { creditService } from '@/lib/credit-service';
import { userService } from '@/lib/user-service';
import type { User } from '@/lib/types';
import { TrendingUp, Users, CreditCard, Target, Calendar, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [user, setUser] = useState<User | null>(null);
  const [creditStats, setCreditStats] = useState<any>(null);
  const [fid] = useState<string>('demo-user'); // In real app, get from MiniKit

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const userData = await userService.getOrCreateUser(fid);
      const stats = await creditService.getCreditStats(fid);

      setUser(userData);
      setCreditStats(stats);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle }: {
    icon: any;
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-text">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-primary mb-1">{value}</p>
      {subtitle && <p className="text-sm text-textMuted">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <Header
        credits={user?.creditsRemaining || 0}
        onBuyCredits={() => {}} // Analytics page doesn't need buy credits
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="glass-card p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gradient">
              Meme Performance Analytics
            </h1>
          </div>
          <p className="text-textMuted max-w-2xl mx-auto">
            Track your meme posting performance and engagement metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CreditCard}
            title="Current Credits"
            value={user?.creditsRemaining?.toString() || '0'}
            subtitle="Available for posting"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Earned"
            value={creditStats?.totalEarned?.toString() || '0'}
            subtitle="Credits earned"
          />
          <StatCard
            icon={Target}
            title="Total Spent"
            value={creditStats?.totalSpent?.toString() || '0'}
            subtitle="Credits used for posting"
          />
          <StatCard
            icon={Users}
            title="Account Tier"
            value={user?.tierType === 'premium' ? 'Premium' : 'Free'}
            subtitle={user?.tierType === 'premium' ? 'Unlimited access' : '5 daily credits'}
          />
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Posting Performance */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Posting Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-textMuted">Total Posts</span>
                <span className="font-semibold text-text">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textMuted">Avg. Engagement Rate</span>
                <span className="font-semibold text-text">0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textMuted">Top Performing Category</span>
                <span className="font-semibold text-text">Crypto</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textMuted">Best Posting Time</span>
                <span className="font-semibold text-text">2-4 PM</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Category Performance
            </h3>
            <div className="space-y-3">
              {[
                { category: 'Crypto', percentage: 40, color: 'bg-purple-500' },
                { category: 'Gen Z', percentage: 25, color: 'bg-pink-500' },
                { category: 'Startup', percentage: 20, color: 'bg-blue-500' },
                { category: 'Fitness', percentage: 10, color: 'bg-green-500' },
                { category: 'Dating', percentage: 5, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-sm text-textMuted w-16">{item.category}</span>
                  <div className="flex-1 bg-surface rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-text w-8">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="font-medium text-text">Posted crypto meme to Farcaster</p>
                <p className="text-sm text-textMuted">2 hours ago</p>
              </div>
              <span className="text-sm text-success">+1 credit spent</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="font-medium text-text">Saved trending meme</p>
                <p className="text-sm text-textMuted">5 hours ago</p>
              </div>
              <span className="text-sm text-textMuted">Free action</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-text">Purchased 100 credits</p>
                <p className="text-sm text-textMuted">1 day ago</p>
              </div>
              <span className="text-sm text-success">+100 credits</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-sm text-textMuted mb-2">💡 Recommendation</p>
              <p className="text-text">Crypto memes perform 3x better on Farcaster than Twitter. Focus your posting there!</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-sm text-textMuted mb-2">📈 Trend Alert</p>
              <p className="text-text">Gen Z humor memes are trending up 40% this week. Consider posting more in this category.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

