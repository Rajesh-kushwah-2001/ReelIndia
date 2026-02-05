import { useEffect, useState } from 'react';
import client from '../api/client';
import useSocket from '../hooks/useSocket';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket(true);

  useEffect(() => {
    client.get('/notifications').then(({ data }) => setNotifications(data));
  }, []);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;
    s.on('notification:new', (n) => setNotifications((prev) => [{ ...n, createdAt: new Date().toISOString() }, ...prev]));
    return () => s.off('notification:new');
  }, [socket]);

  return (
    <div className="space-y-2">
      {notifications.map((n, i) => <div key={n._id || i} className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm">{n.type}</div>)}
    </div>
  );
}
