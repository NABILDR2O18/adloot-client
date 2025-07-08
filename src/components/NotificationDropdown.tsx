import { useEffect, useState, useRef } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";

type Notification = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationDropdown() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${user?.role}/notifications?page=1&limit=10`);
      setNotifications(res.data.data.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setMarking(true);
    try {
      await api.put(`/${user?.role}/notification`);
      fetchNotifications();
    } finally {
      setMarking(false);
    }
  };

  // Mark single as read
  const markOneAsRead = async (id: number) => {
    setMarking(true);
    try {
      await api.put(`/${user?.role}/notification`, { notificationId: id });
      fetchNotifications();
    } finally {
      setMarking(false);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (user?.role) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  // Count unread
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell
          className={unreadCount > 0 ? "text-purple-600" : "text-gray-500"}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-[20px] h-[20px] flex justify-center items-center">
            {unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute md:right-0 -right-4 mt-1 md:w-80 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-lg z-50">
          <div className="flex items-center justify-between md:px-4 px-2 py-2 border-b">
            <span className="font-semibold md:text-sm text-xs">
              Notifications
            </span>
            <button
              onClick={markAllAsRead}
              disabled={marking || notifications.length === 0}
              className="md:text-sm text-xs"
            >
              {marking ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Mark all as read"
              )}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-400 py-2 md:text-sm text-xs">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`md:px-4 px-2 md:py-2 py-1 border-b last:border-b-0 cursor-pointer ${
                    n.is_read
                      ? "bg-white dark:bg-gray-900"
                      : "bg-purple-50 dark:bg-purple-950"
                  }`}
                  onClick={() => !n.is_read && markOneAsRead(n.id)}
                >
                  <div className="flex justify-between items-center md:text-sm text-xs">
                    <span
                      className={`font-medium ${
                        n.is_read ? "" : "text-purple-700"
                      }`}
                    >
                      {n.title}
                    </span>
                    <span className="md:text-sm text-xs text-gray-400">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="md:text-sm text-xs text-gray-600 dark:text-gray-300">
                    {n.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
