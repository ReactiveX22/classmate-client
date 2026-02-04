import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    if (socket) return;

    socket = io(process.env.API_URL || 'http://localhost:3000', {
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
