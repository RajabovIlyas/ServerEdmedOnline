import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { ChatGateway } from './chat.gateway';
import { configModule } from '../configure.root';
import { TokenModule } from '../token/token.module';
import { MessageNotificationGateway } from './message-notification.gateway';
import { ChatMenuGateway } from './chat-menu.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    TokenModule,
    configModule,
  ],
  providers: [
    ChatGateway,
    ChatService,
    MessageNotificationGateway,
    ChatMenuGateway,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
