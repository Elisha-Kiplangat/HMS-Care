import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (namespace: string = '/signaling') => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || window.location.origin;
    const socketInstance = io(`${wsUrl}${namespace}`, {
      autoConnect: true,
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [namespace]);

  return socket;
};
