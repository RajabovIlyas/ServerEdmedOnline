import {
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Discussion {
  @IsString()
  @ApiProperty()
  readonly title: string;
  @IsString()
  @ApiProperty()
  readonly chat: string;
}

export class CreateCommunityDto {
  @IsString()
  @ApiProperty()
  readonly creator: string;
  @IsString()
  @ApiProperty()
  readonly communityPhoto: string;
  @IsString()
  @ApiProperty()
  readonly title: string;
  @IsString()
  @ApiProperty()
  readonly description: string;
  constructor(data) {
    this.creator = data.creator;
    this.communityPhoto = data.communityPhoto;
    this.title = data.title;
    this.description = data.description;
  }
}
