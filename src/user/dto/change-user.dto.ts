import { IS_ENUM, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { genderEnum } from '../enums/gender.enum';

export class ChangeUserDto {
  @IsString()
  @ApiProperty({ type: String, description: 'patronymic' })
  readonly patronymic: string;
  @IsString()
  @ApiProperty({ type: String, description: 'lastName' })
  readonly lastName: string;
  @IsString()
  @ApiProperty({ type: String, description: 'firstName' })
  readonly firstName: string;
  @IsString()
  @ApiProperty({ type: String, description: 'profession' })
  readonly profession: string;
  @IsString()
  @ApiProperty({ type: String, description: 'academicDegrees' })
  readonly academicDegrees: string;
  @IsString()
  @ApiProperty({ type: String, description: 'dateOfBirth' })
  readonly dateOfBirth: string;
  @IsString()
  @ApiProperty({ type: String, description: 'city' })
  readonly city: string;
  @IsString()
  @ApiProperty({
    type: String,
    enum: Object.values(genderEnum),
    description: 'gender',
  })
  readonly gender: genderEnum;
  @IsString()
  @ApiProperty({ type: String, description: 'phoneNumber' })
  readonly phoneNumber: string;
  @IsString()
  @ApiProperty({ type: String, description: 'confidentialityOfPersonalData' })
  readonly confidentialityOfPersonalData: string;
  @IsString()
  @ApiProperty({ type: String, description: 'url' })
  readonly url: string;
  @IsString()
  @ApiProperty({ type: String, description: 'urlTwitter' })
  readonly urlTwitter: string;
  @IsString()
  @ApiProperty({ type: String, description: 'urlFacebook' })
  readonly urlFacebook: string;
  @IsString()
  @ApiProperty({ type: String, description: 'urlLinkedin' })
  readonly urlLinkedin: string;
  @IsString()
  @ApiProperty({ type: String, description: 'urlYoutube' })
  readonly urlYoutube: string;
}
