import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @IsString()
  @ApiProperty()
  readonly title: string;
  @IsString()
  @ApiProperty()
  readonly chatPhoto?: string;
  readonly created?: string;
  @IsString()
  @ApiProperty()
  readonly participants: string[];

  constructor(data) {
    this.title = data.title;
    this.chatPhoto = data.chatPhoto ? data.chatPhoto : undefined;
    this.participants = data.participants;
    this.created = data.created;
  }
}
