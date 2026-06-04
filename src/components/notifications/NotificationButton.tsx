'use client';

import { Bell, BellOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';

export function NotificationButton() {
  const { data: session } = useSession();
  const { 
    permission, 
    loading, 
    isSubscribed, 
    subscribe, 
    sendTestNotification 
  } = usePushNotifications();

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isSubscribed ? (
            <Bell className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          {isSubscribed && (
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 h-2 w-2 p-0 rounded-full bg-green-500" 
            />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isSubscribed ? (
          <>
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              Status: Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={sendTestNotification}>
              Send Test Notification
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground">
              Manage in browser settings
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              Status: Disabled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={subscribe}>
              Enable Notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
