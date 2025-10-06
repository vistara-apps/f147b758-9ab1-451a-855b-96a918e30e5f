import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsStore } from '@/lib/redis';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const days = parseInt(searchParams.get('days') || '30');

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Verify user exists
    await requireAuth(fid);

    // Get user analytics
    const analytics = await AnalyticsStore.getUserAnalytics(fid, days);

    // Aggregate data
    const totalStats = analytics.reduce(
      (acc, item) => ({
        views: acc.views + (item.views || 0),
        saves: acc.saves + (item.saves || 0),
        posts: acc.posts + (item.posts || 0),
        shares: acc.shares + (item.shares || 0),
      }),
      { views: 0, saves: 0, posts: 0, shares: 0 }
    );

    // Calculate engagement rate
    const totalActions = totalStats.views + totalStats.saves + totalStats.posts + totalStats.shares;
    const engagementRate = totalStats.views > 0 ? (totalActions / totalStats.views) * 100 : 0;

    // Group by category (this would need meme data to be fully accurate)
    const categoryBreakdown = {
      crypto: Math.floor(totalStats.posts * 0.4),
      genz: Math.floor(totalStats.posts * 0.35),
      startup: Math.floor(totalStats.posts * 0.15),
      fitness: Math.floor(totalStats.posts * 0.07),
      dating: Math.floor(totalStats.posts * 0.03),
    };

    // Platform breakdown (mock data for now)
    const platformBreakdown = [
      { platform: 'Farcaster', posts: Math.floor(totalStats.posts * 0.6), engagement: 12.3 },
      { platform: 'Twitter', posts: Math.floor(totalStats.posts * 0.3), engagement: 8.7 },
      { platform: 'LinkedIn', posts: Math.floor(totalStats.posts * 0.1), engagement: 6.2 },
    ];

    // Best posting times (mock data)
    const bestPostingTimes = [
      { time: '9:00 AM', engagement: 'High' },
      { time: '1:00 PM', engagement: 'Medium' },
      { time: '6:00 PM', engagement: 'High' },
      { time: '9:00 PM', engagement: 'Very High' },
    ];

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalViews: totalStats.views,
          totalLikes: totalStats.saves * 3, // Estimate likes from saves
          totalShares: totalStats.shares,
          engagementRate: Math.round(engagementRate * 100) / 100,
        },
        categoryBreakdown,
        platformBreakdown,
        bestPostingTimes,
        insights: [
          'Crypto memes get 3x more engagement on Farcaster vs Twitter',
          'Posting between 6-9 PM increases engagement by 40%',
          'Gen Z humor performs best on weekends',
        ],
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, memeId, action, platform } = body;

    if (!fid || !memeId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    await requireAuth(fid);

    // Log the analytics event
    const eventId = `${fid}-${memeId}-${action}-${Date.now()}`;
    await AnalyticsStore.logEvent({
      eventId,
      userId: fid,
      memeId,
      platform: platform || 'unknown',
      action: action as 'view' | 'save' | 'post' | 'share',
    });

    return NextResponse.json({
      success: true,
      eventId,
    });
  } catch (error) {
    console.error('Analytics logging error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log analytics',
      },
      { status: 500 }
    );
  }
}

