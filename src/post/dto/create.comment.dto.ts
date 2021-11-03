import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @ApiProperty()
  readonly text: string;
  @IsString()
  @ApiProperty()
  readonly sender: string;

  constructor(data) {
    this.text = data.text;
    this.sender = data.sender;
  }
}
