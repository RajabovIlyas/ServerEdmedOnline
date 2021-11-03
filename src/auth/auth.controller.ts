import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
  Response,
  ValidationPipe,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req, @Response() res) {
    const token = await this.authService.socialNetworkLogin(req.user);
    return res.redirect(
      `${this.configService.get('FRONT_URL')}/facebook/callback/${
        typeof token !== 'string' ? token?.token : null
      }`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Response() res) {
    const token = await this.authService.socialNetworkLogin(req.user);
    return res.redirect(
      `${this.configService.get('FRONT_URL')}/google/callback/${
        typeof token !== 'string' ? token?.token : null
      }`,
    );
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return HttpStatus.OK;
  }

  @Post('log-in')
  async logIn(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return this.authService.logIn(loginDto);
  }

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Put('/authorization/:id')
  async authorization(@Param('id') id: string) {
    return await this.authService.authorization(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/auth-me')
  async authMe(@Request() req) {
    return this.authService.authMe(req.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.tokenUser);
  }
}
