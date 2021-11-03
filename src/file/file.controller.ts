import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  Request,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { IUser } from '../user/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { uploadAvatar } from './upload/upload.file';
import { ApiTags } from '@nestjs/swagger';

const fs = require('fs');

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', uploadAvatar))
  async uploadAvatar(@UploadedFile() file, @Request() req): Promise<IUser> {
    const userId = req.userId;
    const user = await this.userService.find(userId);

    if (user?.picture) {
      const oldPath = user.picture.split('/');
      if ('default.jpg' !== oldPath[oldPath.length - 1]) {
        const fileNameWithPath =
          'uploads/avatar/' + oldPath[oldPath.length - 1];
        if (fs.existsSync(fileNameWithPath)) {
          fs.unlink(fileNameWithPath, (err) => {});
        }
      }
    }
    return this.userService.updateAvatar(userId, { picture: file.filename });
  }

  @Get('/avatar/:fileName')
  findAvatarImage(@Param('fileName') fileName, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/avatar/' + fileName)));
  }

  @Get('/picture/:fileName')
  findPictureImage(
    @Param('fileName') fileName,
    @Res() res,
  ): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/picture/' + fileName)));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-qualifications')
  @UseInterceptors(FileInterceptor('file', uploadAvatar))
  async uploadFile(@UploadedFile() file, @Request() req): Promise<IUser> {
    const userId = req.userId;
    return this.userService.updateQualification(userId, {
      picture: file.filename,
    });
  }

  @Get('/qualification/:fileName')
  findProfileImage(
    @Param('fileName') fileName,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/Qualifications/' + fileName)),
    );
  }
}
