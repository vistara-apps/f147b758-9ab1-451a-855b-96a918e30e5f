'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { StatsCard } from '@/components/StatsCard';
import { TrendingUp, Heart, Share2, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Performance <span className="text-gradient">Analytics</span>
          </h2>
          <p className="text-text-muted">
            Track what's working and optimize your strategy
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Eye}
            label="Total Views"
            value="12.5K"
            trend={{ value: 23, isPositive: true }}
          />
          <StatsCard
            icon={Heart}
            label="Total Likes"
            value="3.2K"
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            icon={Share2}
            label="Total Shares"
            value="892"
            trend={{ value: 31, isPositive: true }}
          />
          <StatsCard
            icon={TrendingUp}
            label="Engagement Rate"
            value="8.4%"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Top Performing Categories */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-6">Top Performing Categories</h3>
          <div className="space-y-4">
            {[
              { name: 'Crypto', engagement: 92, color: 'from-yellow-500 to-orange-500' },
              { name: 'Gen Z Humor', engagement: 85, color: 'from-purple-500 to-pink-500' },
              { name: 'Startups', engagement: 78, color: 'from-blue-500 to-cyan-500' },
              { name: 'Fitness', engagement: 71, color: 'from-green-500 to-emerald-500' },
              { name: 'Dating', engagement: 65, color: 'from-red-500 to-pink-500' },
            ].map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-text-muted">{category.engagement}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.engagement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Posting Times */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-6">Best Posting Times</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { time: '9:00 AM', engagement: 'High', color: 'text-success' },
              { time: '1:00 PM', engagement: 'Medium', color: 'text-warning' },
              { time: '6:00 PM', engagement: 'High', color: 'text-success' },
              { time: '9:00 PM', engagement: 'Very High', color: 'text-accent' },
            ].map((slot) => (
              <div key={slot.time} className="glass-card p-4 rounded-lg text-center">
                <p className="text-lg font-bold mb-1">{slot.time}</p>
                <p className={`text-sm ${slot.color}`}>{slot.engagement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Platform Performance</h3>
          <div className="space-y-4">
            {[
              { platform: 'Farcaster', posts: 45, engagement: '12.3%', color: 'from-purple-500 to-purple-600' },
              { platform: 'Twitter', posts: 32, engagement: '8.7%', color: 'from-blue-400 to-blue-500' },
              { platform: 'LinkedIn', posts: 18, engagement: '6.2%', color: 'from-blue-600 to-blue-700' },
            ].map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <p className="font-semibold mb-1">{platform.platform}</p>
                  <p className="text-sm text-text-muted">{platform.posts} posts</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">{platform.engagement}</p>
                  <p className="text-xs text-text-muted">Avg engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 glass-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">💡 Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-success">✓</span>
              <span className="text-sm">Crypto memes get 3x more engagement on Farcaster vs Twitter</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success">✓</span>
              <span className="text-sm">Posting between 6-9 PM increases engagement by 40%</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success">✓</span>
              <span className="text-sm">Gen Z humor performs best on weekends</span>
            </li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
