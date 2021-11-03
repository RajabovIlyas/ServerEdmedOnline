import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @ApiProperty()
  readonly text: string;
  @IsString()
  @ApiProperty()
  readonly pages: string[];
  @IsString()
  @ApiProperty()
  readonly createdCommunity: string;

  constructor(data) {
    this.text = data.text;
    this.pages = data.pages;
    this.createdCommunity = data.createdCommunity;
  }
}
