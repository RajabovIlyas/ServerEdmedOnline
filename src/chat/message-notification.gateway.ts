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

@WebSocketGateway({ namespace: 'message-notification' })
export class MessageNotificationGateway
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
      const { user } = await this.tokenService.verify(
        client.handshake.auth?.token,
      );
      !user && client.disconnect();

      client.join(String(user));
      const countNotification = await this.chatService.messageNotificationCount(
        user,
      );
      this.wss.to(String(user)).emit('notification:get', {
        countNotification,
      });
    } catch (error) {
      this.wss
        .to(client.rooms.values().next().value)
        .emit('error', { message: 'Данные не соответсвтуют действительность' });
    }
  }

  handleDisconnect(client: Socket): any {
    this.logger.log('Disconnect', client.id);
  }

  @SubscribeMessage('notification:update')
  async notificationUpdateClick(client: Socket, message) {
    console.log('click notification:update');
    const { user } = await this.tokenService.verify(
      client.handshake.auth?.token,
    );
    !user && client.disconnect();
    console.log('notification:update idUser', user);
    const countNotification = await this.chatService.messageNotificationCount(
      user,
    );

    this.wss.to(String(user)).emit('notification:get', {
      countNotification,
    });
  }

  async notificationUpdate(idUser) {
    const countNotification = await this.chatService.messageNotificationCount(
      idUser,
    );
    console.log('idUser', idUser, countNotification);
    this.wss.to(String(idUser)).emit('notification:get', {
      countNotification,
    });
  }

  async notificationUpdateForUsers(idUsers: string[]) {
    for( const idUser of idUsers) {
      const countNotification = await this.chatService.messageNotificationCount(
        idUser,
      );
      console.log('idUser', idUser, countNotification);
      this.wss.to(String(idUser)).emit('notification:get', {
        countNotification,
      });
    }
  }
}
