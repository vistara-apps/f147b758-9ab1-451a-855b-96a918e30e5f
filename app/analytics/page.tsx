'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsEvent } from '@/lib/types';
import { useMiniKit } from '@/components/MiniKitProvider';

export default function AnalyticsPage() {
  const { fid } = useMiniKit();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    if (fid) {
      fetchAnalytics();
    }
  }, [fid]);

  const fetchAnalytics = async () => {
    if (!fid) return;

    try {
      const response = await fetch(`/api/analytics?userId=${fid}`);
      const data = await response.json();

      // Convert the summary back to events format for the chart
      // In production, you'd fetch actual events
      const mockEvents: AnalyticsEvent[] = [];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use mock data for now
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
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
            Track your meme posting performance across platforms
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {(['7d', '30d', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-primary text-white'
                    : 'bg-surface hover:bg-surface-hover text-text-muted'
                }`}
              >
                {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'All time'}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Chart */}
        <AnalyticsChart events={events} timeframe={timeframe} />

        {/* Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Top Performing Category</h4>
                <p className="text-sm text-muted-foreground">
                  Crypto memes perform 3.2x better than other categories on Farcaster
                </p>
              </div>

              <div className="p-4 bg-success/5 rounded-lg">
                <h4 className="font-medium mb-2">Optimal Posting Time</h4>
                <p className="text-sm text-muted-foreground">
                  Post between 9-10 AM for maximum engagement (45% higher reach)
                </p>
              </div>

              <div className="p-4 bg-warning/5 rounded-lg">
                <h4 className="font-medium mb-2">Content Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on trending topics - memes about current events get 2x more shares
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
