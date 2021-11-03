import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailUserDto {
  @IsString()
  @ApiProperty({ type: String, description: 'newEmail' })
  readonly newEmail: string;
  @IsString()
  @ApiProperty({ type: String, description: 'oldEmail' })
  readonly oldEmail: string;
}
