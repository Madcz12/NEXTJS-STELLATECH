import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getAdminMessaging } from '@/lib/firebase-admin.config';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { userId, userIds, title, body, data, sendToAll } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    let targetSubscriptions;

    if (sendToAll) {
      // Send to all subscribed users
      targetSubscriptions = await prisma.pushSubscription.findMany();
    } else if (userId) {
      // Send to specific user
      targetSubscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });
    } else if (userIds && Array.isArray(userIds)) {
      // Send to multiple users
      targetSubscriptions = await prisma.pushSubscription.findMany({
        where: {
          userId: { in: userIds },
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Must specify userId, userIds, or sendToAll' },
        { status: 400 }
      );
    }

    if (targetSubscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found for the specified users' },
        { status: 404 }
      );
    }

    // Prepare the message
    const messaging = getAdminMessaging();
    const tokens = targetSubscriptions.map(sub => sub.token);

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens,
    };

    // Send the notifications
    const response = await messaging.sendEachForMulticast(message);

    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });

      // Delete invalid tokens from database
      await prisma.pushSubscription.deleteMany({
        where: {
          token: { in: failedTokens },
        },
      });
    }

    return NextResponse.json({
      message: 'Notifications sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount,
      totalSent: targetSubscriptions.length,
    });
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
