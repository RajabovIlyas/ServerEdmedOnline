import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsString()
  @ApiProperty()
  readonly text: string;
  @IsString()
  @ApiProperty()
  readonly sender: string;

  @IsString()
  @ApiProperty()
  readonly read: string;

  constructor(data) {
    this.sender = data.sender;
    this.text = data.text;
    this.read = data.read;
  }
}
