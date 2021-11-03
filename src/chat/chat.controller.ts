import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from '../community/community.service';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommunityDto } from '../community/dto/create.community.dto';
import { CreateChatDto } from './dto/create.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';

@ApiTags('Чат')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createChat(@Request() req, @Body() body: CreateChatDto) {
    const data = new CreateChatDto({
      ...body,
      created: req.userId,
      participants: [...body.participants, req.userId],
    });
    return this.chatService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('message/:id')
  async addMessage(@Request() req, @Param('id') id: string) {
    const message = new CreateMessageDto({
      ...req.body,
      sender: req.userId,
    });
    return this.chatService.addMessage(id, req.userId, message);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('message/:id')
  async getMessage(@Request() req, @Param('id') id: string) {
    const { page = '1', max = '20' }: { page: string; max: string } = req.query;
    return this.chatService.getMessage(
      id,
      req.userId,
      Number.parseInt(page),
      Number.parseInt(max),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getChats(@Request() req) {
    const { page = '1', max = '10' }: { page: string; max: string } = req.query;
    return this.chatService.getChats(
      req.userId,
      Number.parseInt(page),
      Number.parseInt(max),
    );
  }
}
