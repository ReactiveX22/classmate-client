import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    if (socket) return;

    const url =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (typeof window !== 'undefined' ? '' : 'http://localhost:3000');
    socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
    });
    return socket;
  },

  getSocket: () => socket,

  disconnect: () => {
    if (!socket) return;

    socket.disconnect();
    socket = null;
  },
};
