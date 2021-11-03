import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTokenDto {
  @IsString()
  @ApiProperty({ type: String, description: 'token' })
  token: string;
  @IsString()
  @ApiProperty({ type: String, description: 'user' })
  user: string;
}
