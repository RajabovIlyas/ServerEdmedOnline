import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangeUserDto } from './dto/change-user.dto';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeEmailUserDto } from './dto/change-email-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Пользватель')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async changeProfile(@Request() req, @Body() changeUserDto: ChangeUserDto) {
    return this.userService.update(req.userId, changeUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('password')
  async changePassword(
    @Request() req,
    @Body() changePasswordUserDto: ChangePasswordUserDto,
  ) {
    return this.userService.updatePassword(req.userId, changePasswordUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('email')
  async changeEmail(
    @Request() req,
    @Body() changeEmailUserDto: ChangeEmailUserDto,
  ) {
    return this.userService.updateEmail(req.userId, changeEmailUserDto);
  }


}
