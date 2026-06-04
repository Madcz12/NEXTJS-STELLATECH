import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendPushNotificationToUser } from '@/lib/push-notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Send a test notification to the current user
    const result = await sendPushNotificationToUser(
      session.user.id!,
      '🔔 Notificación de Prueba',
      '¡Las notificaciones push están funcionando correctamente! 🎉',
      {
        type: 'test',
        timestamp: new Date().toISOString(),
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send test notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Test notification sent successfully',
      sentCount: result.sentCount,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}
