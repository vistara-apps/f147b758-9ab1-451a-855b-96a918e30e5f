import { farcasterAPI } from './api/farcaster';
import type { User } from './types';

export interface Notification {
  id: string;
  type: 'saved_meme_viral' | 'new_pack_released' | 'credits_low' | 'daily_reset';
  title: string;
  message: string;
  actionUrl?: string;
  timestamp: string;
  read: boolean;
}

export class NotificationService {
  // In-memory storage for demo - in production, use database
  private notifications: Map<string, Notification[]> = new Map();

  async createNotification(fid: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const userNotifications = this.notifications.get(fid) || [];

    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    userNotifications.unshift(newNotification); // Add to beginning
    this.notifications.set(fid, userNotifications.slice(0, 50)); // Keep only last 50
  }

  async getUserNotifications(fid: string): Promise<Notification[]> {
    return this.notifications.get(fid) || [];
  }

  async markAsRead(fid: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(fid) || [];
    const notification = userNotifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      this.notifications.set(fid, userNotifications);
    }
  }

  async markAllAsRead(fid: string): Promise<void> {
    const userNotifications = this.notifications.get(fid) || [];
    userNotifications.forEach(notification => {
      notification.read = true;
    });
    this.notifications.set(fid, userNotifications);
  }

  // Specific notification triggers
  async notifySavedMemeViral(fid: string, memeId: string, engagementCount: number): Promise<void> {
    await this.createNotification(fid, {
      type: 'saved_meme_viral',
      title: '🔥 Your Saved Meme Went Viral!',
      message: `One of your saved memes has reached ${engagementCount.toLocaleString()} engagements!`,
      actionUrl: `/meme/${memeId}`,
    });
  }

  async notifyNewPackReleased(fid: string, packName: string): Promise<void> {
    await this.createNotification(fid, {
      type: 'new_pack_released',
      title: '✨ New Meme Pack Available',
      message: `Fresh ${packName} memes have been added to your collection!`,
      actionUrl: '/collections',
    });
  }

  async notifyCreditsLow(fid: string, currentCredits: number): Promise<void> {
    if (currentCredits <= 10) {
      await this.createNotification(fid, {
        type: 'credits_low',
        title: '⚡ Running Low on Credits',
        message: `You have ${currentCredits} credits remaining. Top up to keep posting!`,
        actionUrl: '/?tab=credits',
      });
    }
  }

  async notifyDailyReset(fid: string, newCredits: number): Promise<void> {
    await this.createNotification(fid, {
      type: 'daily_reset',
      title: '🎁 Daily Credits Reset',
      message: `You've received ${newCredits} free credits for today!`,
    });
  }

  // Frame notification system (for Farcaster frames)
  async sendFrameNotification(fid: string, title: string, body: string): Promise<void> {
    try {
      // In a real implementation, this would send a notification through Farcaster
      // For now, we'll just create a local notification
      await this.createNotification(fid, {
        type: 'saved_meme_viral', // Generic type
        title,
        message: body,
      });

      console.log(`Frame notification sent to user ${fid}: ${title} - ${body}`);
    } catch (error) {
      console.error('Failed to send frame notification:', error);
    }
  }

  // Check for viral memes and send notifications
  async checkForViralMemes(): Promise<void> {
    // In a real implementation, this would:
    // 1. Query saved memes from all users
    // 2. Check their current engagement on platforms
    // 3. Send notifications for memes that crossed viral thresholds

    console.log('Checking for viral memes...');
    // Mock implementation - in production, this would run periodically
  }

  // Weekly pack update notifications
  async sendWeeklyPackUpdates(): Promise<void> {
    // In a real implementation, this would:
    // 1. Update all premium packs with new content
    // 2. Send notifications to users who have unlocked those packs

    console.log('Sending weekly pack update notifications...');
    // Mock implementation
  }
}

export const notificationService = new NotificationService();

