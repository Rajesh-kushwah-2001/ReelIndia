import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(enabled) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const token = localStorage.getItem('youplay_token');
    socketRef.current = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', { auth: { token } });
    return () => socketRef.current?.disconnect();
  }, [enabled]);

  return socketRef;
}
