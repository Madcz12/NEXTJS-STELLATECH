import { prisma } from '@/lib/prisma';
import { getAdminMessaging } from './firebase-admin.config';

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
};

type SendResult = {
  success: boolean;
  sentCount: number;
  failureCount: number;
  error?: unknown;
};

/**
 * Send a push notification to a specific user
 */
export async function sendPushNotificationToUser(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string> = {}
): Promise<SendResult> {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      return { success: false, sentCount: 0, failureCount: 0, error: 'No subscriptions found' };
    }

    return await sendNotifications(subscriptions.map((s: { token: string }) => s.token), title, body, data);
  } catch (error) {
    console.error('Error sending push notification to user:', error);
    return { success: false, sentCount: 0, failureCount: 0, error };
  }
}

/**
 * Send push notifications to multiple tokens
 */
export async function sendNotifications(
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, string> = {}
): Promise<SendResult> {
  if (tokens.length === 0) {
    return { success: true, sentCount: 0, failureCount: 0 };
  }

  try {
    const messaging = getAdminMessaging();
    
    // Add default icon if not present in data
    const messageData = {
      ...data,
      url: data.url || '/',
    };

    const message = {
      notification: {
        title,
        body,
      },
      data: messageData,
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp: any, idx: number) => {
        if (!resp.success) {
          const error = resp.error;
          if (
            error?.code === 'messaging/invalid-registration-token' ||
            error?.code === 'messaging/registration-token-not-registered'
          ) {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      if (failedTokens.length > 0) {
        await prisma.pushSubscription.deleteMany({
          where: {
            token: { in: failedTokens },
          },
        });
      }
    }

    return {
      success: true,
      sentCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Error sending multicast notifications:', error);
    return { success: false, sentCount: 0, failureCount: 0, error };
  }
}

/**
 * Send order confirmation notification
 */
export async function sendOrderConfirmation(
  userId: string,
  orderId: string,
  total: number
): Promise<SendResult> {
  return sendPushNotificationToUser(
    userId,
    'Order Confirmed! 🛍️',
    `Your order #${orderId.slice(-6)} for $${total.toFixed(2)} has been confirmed.`,
    {
      type: 'order_status',
      id: orderId,
      url: `/orders/${orderId}`,
    }
  );
}

/**
 * Send shipping update notification
 */
export async function sendShippingUpdate(
  userId: string,
  orderId: string,
  status: string
): Promise<SendResult> {
  return sendPushNotificationToUser(
    userId,
    'Order Update 🚚',
    `Your order #${orderId.slice(-6)} is now ${status}.`,
    {
      type: 'order_status',
      id: orderId,
      url: `/orders/${orderId}`,
    }
  );
}
