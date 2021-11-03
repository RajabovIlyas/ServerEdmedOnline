import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { TokenService } from '../token/token.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IChatMenu } from './interfaces/chat-menu.interface';

@WebSocketGateway({ namespace: 'chats-user' })
export class ChatMenuGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly tokenService: TokenService,
  ) {}

  @WebSocketServer() wss: Server;

  private logger = new Logger('MessageNotificationGateway');

  afterInit(server: Server): any {
    this.logger.log('Initialized Socket.io in message-notification');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      this.logger.log('Connect', client.id);
      const result = await this.tokenService.verify(
        client.handshake.auth?.token,
      );
      !result && client.disconnect();
      client.join(String(result.user));
      const iterator1 = client.rooms.values();
      const countNotification = await this.chatService.messagesForUser(
        result.user,
        1,
        20,
      );

      this.wss.to(iterator1.next().value).emit('chats:get', countNotification);
    } catch (error) {
      this.wss
        .to(client.rooms.values().next().value)
        .emit('error', { message: 'Данные не соответсвтуют действительность' });
    }
  }

  handleDisconnect(client: Socket): any {
    this.logger.log('Disconnect', client.id);
  }

  async sendNewMessage(idUsers: string[]) {
    for (const idUser of idUsers) {
      const countNotification = await this.chatService.messagesForUser(
        idUser,
        1,
        20,
      );

      this.wss.to(String(idUser)).emit('chats:get', countNotification);
    }
  }
}
