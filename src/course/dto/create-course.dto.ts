import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class BannerDto {
  @IsString()
  @ApiProperty()
  backgroundImg: string;
  @IsString()
  @ApiProperty()
  title: string;
  @IsString()
  @ApiProperty()
  speakerName: string;
  @IsString()
  @ApiProperty()
  speakerShortDescription: string;
}

class CourseTDDto {
  @IsString()
  @ApiProperty()
  readonly title: string;
  @IsString()
  @ApiProperty()
  readonly content: string;
}

class WebinarDto {
  @IsString()
  @ApiProperty()
  readonly promoImg: string;
  @IsString()
  @ApiProperty()
  readonly format: string;
  @IsString()
  @ApiProperty()
  readonly date: Date;
  @IsBoolean()
  @ApiProperty()
  readonly isPaid: boolean;
  @IsNumber()
  @ApiProperty()
  readonly cost: number;
  @IsString()
  @ApiProperty()
  readonly currency: string;
  @IsString()
  @ApiProperty()
  readonly promoCode: string;
  @IsString()
  @ApiProperty()
  readonly video: string;
  @IsNumber()
  @ApiProperty()
  readonly videoDuration: number;
  @IsString()
  @ApiProperty()
  readonly title: string;
  @IsString()
  @ApiProperty()
  readonly content: string;
  @IsString()
  @ApiProperty()
  readonly personalDiscount: number;
}

class AboutSpeakerDto {
  @IsString()
  @ApiProperty()
  img: string;
  @IsString()
  @ApiProperty()
  fullName: string;
  @IsString()
  @ApiProperty()
  career: string;
  @IsString()
  @ApiProperty()
  description: string;
}

class FullCoursePayCardDto {
  @IsNumber()
  @ApiProperty()
  cost: number;
  @IsString()
  @ApiProperty()
  currency: string;
  @IsNumber()
  @ApiProperty()
  discount: number;
  @IsNumber()
  @ApiProperty()
  costWithDiscount: number;
  @IsString()
  @ApiProperty()
  promoCodeDiscount: string;
}

class MainContentDto {
  @ApiProperty()
  readonly youWillLearn: CourseTDDto;
  @ApiProperty()
  eventProgram: CourseTDDto;
  @ApiProperty()
  readonly vebinars: WebinarDto[];
  @ApiProperty()
  readonly fullCoursePayCard: FullCoursePayCardDto;
}

export class CreateCourseDto {
  @ApiProperty()
  readonly banner: BannerDto;
  @ApiProperty()
  readonly mainContent: MainContentDto;
  @ApiProperty()
  readonly aboutSpeaker: AboutSpeakerDto;
}
