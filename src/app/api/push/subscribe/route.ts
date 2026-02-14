import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { token },
    });

    if (existingSubscription) {
      // Update if exists but belongs to different user
      if (existingSubscription.userId !== session.user.id) {
        await prisma.pushSubscription.update({
          where: { token },
          data: { userId: session.user.id },
        });
      }
      
      return NextResponse.json({
        message: 'Already subscribed',
        subscription: existingSubscription,
      });
    }

    // Create new subscription
    const subscription = await prisma.pushSubscription.create({
      data: {
        userId: session.user.id!,
        token,
      },
    });

    return NextResponse.json({
      message: 'Successfully subscribed to notifications',
      subscription,
    });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to notifications' },
      { status: 500 }
    );
  }
}
