import { Socket, Server } from 'socket.io';
export interface ISocketAuth extends Socket {
  result: {
    user: string;
    token: string;
  };
}
