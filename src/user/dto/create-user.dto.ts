import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;
  @IsString()
  @ApiProperty({ type: String, description: 'lastName' })
  readonly lastName: string;
  @IsString()
  @ApiProperty({ type: String, description: 'firstName' })
  readonly firstName: string;
  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  readonly password: string;
}
