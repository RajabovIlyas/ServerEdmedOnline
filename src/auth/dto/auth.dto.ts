import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @IsNotEmpty()
  token: string;
}

export class LoginDto {
  @IsString()
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;
  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  readonly password: string;
}

export class SignUpDto {
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

export class SocialNetworkDto {
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
  @ApiProperty({ type: String, description: 'picture' })
  readonly picture: string;
}
