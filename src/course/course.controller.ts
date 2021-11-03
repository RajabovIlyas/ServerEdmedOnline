import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Request,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { uploadAvatar, uploadPicture } from '../file/upload/upload.file';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

@ApiTags('Курсы')
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCourse(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(req.userId, createCourseDto);
  }

  async deleteFile(file: string) {
    if (!file) {
      return;
    }
    const oldPath = file.split('/');
    if ('default.jpg' !== oldPath[oldPath.length - 1]) {
      const fileNameWithPath = 'uploads/avatar/' + oldPath[oldPath.length - 1];
      if (fs.existsSync(fileNameWithPath)) {
        fs.unlink(fileNameWithPath, (err) => {});
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/upload/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'backgroundImg', maxCount: 1 },
        { name: 'imgSpeaker', maxCount: 1 },
        { name: 'webinarImg' },
      ],
      uploadPicture,
    ),
  )
  async updatePictureCourse(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
    @Param('id') id: string,
  ) {
    const course = await this.courseService.getElementByIdAndUser(
      id,
      req.userId,
    );
    if (files['backgroundImg'] !== undefined) {
      await files['backgroundImg'].forEach((value) => {
        this.deleteFile(course.banner.backgroundImg);
        course.banner.backgroundImg = value.filename;
      });
    }
    if (files['imgSpeaker'] !== undefined) {
      await files['imgSpeaker'].forEach((value) => {
        this.deleteFile(course.aboutSpeaker.img);
        course.aboutSpeaker.img = value.filename;
      });
    }
    if (files[`webinarImg`] !== undefined) {
      await files[`webinarImg`].forEach((value) => {
        const index = parseInt(value.originalname);
        this.deleteFile(course.mainContent.vebinars[index].promoImg);
        course.mainContent.vebinars[index].promoImg = value.filename;
      });
    }
    return this.courseService.updateCourseAll(course);
  }

  @Get()
  async getAll() {
    return this.courseService.getAll();
  }
}
