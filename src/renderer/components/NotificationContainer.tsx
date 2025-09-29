import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore, type Notification } from '../stores/useNotificationStore';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-300',
  error: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300',
  warning: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-300',
  info: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
};

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const { removeNotification } = useNotificationStore();
  const Icon = iconMap[notification.type];

  return (
    <div className={`bg-gradient-to-r ${colorMap[notification.type]} border rounded-lg p-4 shadow-lg backdrop-blur-sm animate-slide-in max-w-sm`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{notification.title}</h4>
          {notification.message && (
            <p className="text-sm opacity-90 mt-1">{notification.message}</p>
          )}
        </div>
        {notification.duration !== 0 && (
          <button
            onClick={() => removeNotification(notification.id)}
            className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function NotificationContainer() {
  const { notifications } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}