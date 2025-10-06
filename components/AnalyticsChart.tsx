'use client';

import { useMemo } from 'react';
import { AnalyticsEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Heart, MessageCircle, Share2, Target } from 'lucide-react';

interface AnalyticsChartProps {
  events: AnalyticsEvent[];
  timeframe?: '7d' | '30d' | 'all';
}

export function AnalyticsChart({ events, timeframe = '7d' }: AnalyticsChartProps) {
  const analytics = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeframe) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        cutoffDate.setFullYear(2020); // Far in the past
        break;
    }

    const filteredEvents = events.filter(event =>
      new Date(event.postedAt) >= cutoffDate
    );

    const stats = {
      totalPosts: filteredEvents.length,
      totalLikes: filteredEvents.reduce((sum, event) => sum + event.likes, 0),
      totalShares: filteredEvents.reduce((sum, event) => sum + event.shares, 0),
      totalComments: filteredEvents.reduce((sum, event) => sum + event.comments, 0),
      platformBreakdown: {} as Record<string, { posts: number; engagement: number }>,
      categoryPerformance: {} as Record<string, { posts: number; avgEngagement: number }>,
      bestPostingTimes: [] as Array<{ hour: number; engagement: number }>,
    };

    // Calculate platform breakdown
    filteredEvents.forEach(event => {
      if (!stats.platformBreakdown[event.platform]) {
        stats.platformBreakdown[event.platform] = { posts: 0, engagement: 0 };
      }
      stats.platformBreakdown[event.platform].posts += 1;
      stats.platformBreakdown[event.platform].engagement +=
        event.likes + event.shares + event.comments;
    });

    // Calculate best posting times (simplified)
    const hourlyStats: Record<number, number> = {};
    filteredEvents.forEach(event => {
      const hour = new Date(event.postedAt).getHours();
      if (!hourlyStats[hour]) hourlyStats[hour] = 0;
      hourlyStats[hour] += event.likes + event.shares + event.comments;
    });

    stats.bestPostingTimes = Object.entries(hourlyStats)
      .map(([hour, engagement]) => ({ hour: parseInt(hour), engagement }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);

    return stats;
  }, [events, timeframe]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            Posts in selected timeframe
          </p>
        </CardContent>
      </Card>

      {/* Total Likes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <Heart className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.totalLikes)}</div>
          <p className="text-xs text-muted-foreground">
            Across all platforms
          </p>
        </CardContent>
      </Card>

      {/* Total Shares */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
          <Share2 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.totalShares)}</div>
          <p className="text-xs text-muted-foreground">
            Shares and retweets
          </p>
        </CardContent>
      </Card>

      {/* Total Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          <MessageCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.totalComments)}</div>
          <p className="text-xs text-muted-foreground">
            Comments and replies
          </p>
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.platformBreakdown).map(([platform, stats]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {platform}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {stats.posts} posts
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNumber(stats.engagement)}</div>
                  <div className="text-xs text-muted-foreground">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Posting Times */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Best Posting Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.bestPostingTimes.map((time, index) => (
              <div key={time.hour} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm">
                    {time.hour}:00 - {time.hour + 1}:00
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNumber(time.engagement)}</div>
                  <div className="text-xs text-muted-foreground">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

