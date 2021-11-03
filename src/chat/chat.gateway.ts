import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { TokenService } from '../token/token.service';
import { CreateMessageDto } from './dto/create.message.dto';
import { MessageNotificationGateway } from './message-notification.gateway';
import { ChatMenuGateway } from './chat-menu.gateway';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly tokenService: TokenService,
    private readonly messageNotificationGateway: MessageNotificationGateway,
    private readonly chatMenuGateway: ChatMenuGateway,
  ) {}

  @WebSocketServer() wss: Server;

  private logger = new Logger('ChatGateway');

  afterInit(server: Server): any {
    this.logger.log('Initialized Socket.io in chat');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      this.logger.log('Connect', client.id);
      const result = await this.tokenService.verify(
        client.handshake.auth?.token,
      );
      !result && client.disconnect();
      const { idChat } = client.handshake.query;
      const findRoom = await this.chatService.findRoom(
        idChat.toString(),
        result.user,
      );
      !findRoom && client.disconnect();
      client.join(idChat);
      const iterator1 = client.rooms.values();
      const messages = await this.chatService.getMessage(
        idChat.toString(),
        result.user,
        1,
        10,
      );
      this.wss
        .to(iterator1.next().value)
        .emit('messages:first', { messages, idUser: result.user });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): any {
    this.logger.log('Disconnect', client.id);
  }
  // Получение нового сообщения
  @SubscribeMessage('message:new')
  async newMessage(client: Socket, { message }) {
    const { user } = await this.tokenService.verify(
      client.handshake.auth?.token,
    );
    const { idChat } = client.handshake.query;
    const findRoom = await this.chatService.findRoom(idChat.toString(), user);
    !findRoom && client.disconnect();
    const newMessage = await this.chatService.addMessage(
      idChat.toString(),
      user,
      new CreateMessageDto({ text: message, sender: user, read: user }),
    );
    this.wss.to(idChat).emit('message:new', newMessage);
    const userIsRooms = await this.chatService.getUsersInRoom(
      idChat.toString(),
      user,
    );
    await this.chatMenuGateway.sendNewMessage(userIsRooms);
    await this.messageNotificationGateway.notificationUpdateForUsers(userIsRooms);
  }

  // Прочтение сообщения
  @SubscribeMessage('message:read')
  async messageRead(client: Socket, { idMessages }) {
    const { user } = await this.tokenService.verify(
      client.handshake.auth?.token,
    );
    const { idChat } = client.handshake.query;
    const findRoom = await this.chatService.findRoom(idChat.toString(), user);
    !findRoom && client.disconnect();
    await this.chatService.readMessage(idChat.toString(), user, idMessages);
    await this.messageNotificationGateway.notificationUpdate(user);
  }

  // Отправка прочитанных сообщений
  @SubscribeMessage('notification:update')
  async notificationUpdate(client: Socket, {}) {
    const { user } = await this.tokenService.verify(
      client.handshake.auth?.token,
    );
    await this.messageNotificationGateway.notificationUpdate(user);
  }

  // Получение нового сообщения
  @SubscribeMessage('message:old')
  async loadOldMessage(
    client: Socket,
    { idMessage, size }: { idMessage: string; size: number },
  ) {
    console.log('oldMessage');
    const { user } = await this.tokenService.verify(
      client.handshake.auth?.token,
    );

    const { idChat } = client.handshake.query;
    const findRoom = await this.chatService.findRoom(idChat.toString(), user);
    !findRoom && client.disconnect();
    const loadAldMessage = await this.chatService.getAldMessage(
      idChat.toString(),
      user,
      idMessage,
      size,
    );
    const iterator1 = client.rooms.values();
    this.wss
      .to(iterator1.next().value)
      .emit('messages:old', { messages: loadAldMessage, idUser: user });
  }
}
