'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { StatsCard } from '@/components/StatsCard';
import { TrendingUp, Heart, Share2, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    engagementRate: number;
  };
  categoryBreakdown: Record<string, number>;
  platformBreakdown: Array<{
    platform: string;
    posts: number;
    engagement: number;
  }>;
  bestPostingTimes: Array<{
    time: string;
    engagement: string;
  }>;
  insights: string[];
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fid) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics?fid=${user?.fid}&days=30`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg pb-20 lg:pb-0">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
            <p className="text-textMuted">
              Please connect your Farcaster account to view analytics
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="ml-2 text-textMuted">Loading analytics...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-12 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchAnalytics}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Analytics Content */}
        {analytics && !isLoading && !error && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={Eye}
                label="Total Views"
                value={analytics.overview.totalViews.toLocaleString()}
                trend={{ value: 23, isPositive: true }}
              />
              <StatsCard
                icon={Heart}
                label="Total Likes"
                value={analytics.overview.totalLikes.toLocaleString()}
                trend={{ value: 18, isPositive: true }}
              />
              <StatsCard
                icon={Share2}
                label="Total Shares"
                value={analytics.overview.totalShares.toLocaleString()}
                trend={{ value: 31, isPositive: true }}
              />
              <StatsCard
                icon={TrendingUp}
                label="Engagement Rate"
                value={`${analytics.overview.engagementRate}%`}
                trend={{ value: 12, isPositive: true }}
              />
            </div>

            {/* Top Performing Categories */}
            <div className="glass-card p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-6">Top Performing Categories</h3>
              <div className="space-y-4">
                {Object.entries(analytics.categoryBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, engagement]) => {
                    const colors: Record<string, string> = {
                      crypto: 'from-yellow-500 to-orange-500',
                      genz: 'from-purple-500 to-pink-500',
                      startup: 'from-blue-500 to-cyan-500',
                      fitness: 'from-green-500 to-emerald-500',
                      dating: 'from-red-500 to-pink-500',
                    };
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize">{category}</span>
                          <span className="text-sm text-text-muted">{engagement}%</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[category] || 'from-gray-500 to-gray-600'}`}
                            style={{ width: `${engagement}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Best Posting Times */}
            <div className="glass-card p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-6">Best Posting Times</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.bestPostingTimes.map((slot) => (
                  <div key={slot.time} className="glass-card p-4 rounded-lg text-center">
                    <p className="text-lg font-bold mb-1">{slot.time}</p>
                    <p className={`text-sm ${
                      slot.engagement === 'Very High' ? 'text-accent' :
                      slot.engagement === 'High' ? 'text-success' :
                      slot.engagement === 'Medium' ? 'text-warning' : 'text-textMuted'
                    }`}>
                      {slot.engagement}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Platform Performance</h3>
              <div className="space-y-4">
                {analytics.platformBreakdown.map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <p className="font-semibold mb-1">{platform.platform}</p>
                      <p className="text-sm text-text-muted">{platform.posts} posts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">{platform.engagement}%</p>
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
                {analytics.insights.map((insight, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-success">✓</span>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
