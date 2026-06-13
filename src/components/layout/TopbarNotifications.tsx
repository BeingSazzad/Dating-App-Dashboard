import * as React from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { socketUrl } from "@/redux/api/baseApi";
import {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
  type NotificationItem,
} from "@/redux/apiSlices/admin/notificationApi";
import { io, type Socket } from "socket.io-client";

interface TopbarNotificationsProps {
  userId?: string;
}

export function TopbarNotifications({ userId }: TopbarNotificationsProps) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const {
    data: notificationRes,
    refetch: refetchNotifications,
    isFetching,
  } = useGetNotificationsQuery(undefined, {
    skip: !userId,
  });
  const [readNotification] = useReadNotificationMutation();
  const [readAllNotifications] = useReadAllNotificationsMutation();
  const notifications = notificationRes?.data?.data ?? [];
  const unreadCount = notificationRes?.data?.unreadCount ?? 0;

  React.useEffect(() => {
    if (!userId) return;

    const socket: Socket = io(socketUrl, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    const eventName = `get-notification::${userId}`;
    socket.on(eventName, refetchNotifications);

    return () => {
      socket.off(eventName, refetchNotifications);
      socket.disconnect();
    };
  }, [refetchNotifications, userId]);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleRead = (notification: NotificationItem) => {
    if (notification.isRead) return;

    toast.promise(
      readNotification({ id: notification._id })
        .unwrap()
        .then(() => refetchNotifications()),
      {
        loading: "Marking notification as read...",
        success: "Notification marked as read.",
        error: "Failed to update notification.",
      },
    );
  };

  const handleReadAll = () => {
    toast.promise(
      readAllNotifications()
        .unwrap()
        .then(() => refetchNotifications()),
      {
        loading: "Marking all notifications as read...",
        success: "All notifications marked as read.",
        error: "Failed to update notifications.",
      },
    );
  };

  return (
    <div ref={panelRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReadAll}
              disabled={!notifications.length || isFetching}
            >
              Read all
            </Button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications?.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  className={`block w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50 ${notification.isRead ? "bg-background" : "bg-primary/5"
                    }`}
                  onClick={() => handleRead(notification)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
