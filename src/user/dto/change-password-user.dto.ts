import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordUserDto {
  @IsString()
  @ApiProperty({ type: String, description: 'newPassword' })
  readonly newPassword: string;
  @IsString()
  @ApiProperty({ type: String, description: 'oldPassword' })
  readonly oldPassword: string;
}
