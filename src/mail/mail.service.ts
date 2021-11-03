import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailUser } from './interfaces/mail-user.interface';
import { htmlMessageAuthorization } from './utils/message';
import { createTransport, Transporter } from 'nodemailer';
const smtpTransport = require('nodemailer-smtp-transport');
import { UserService } from '../user/user.service';

@Injectable()
export class MailService {
  mailerService: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.mailerService = createTransport(
      smtpTransport({
        service: 'gmail',
        host: 'smtp.google.com',
        port: 587,
        secure: false, // true for 587, false for other ports
        requireTLS: true,
        auth: {
          user: this.configService.get('EMAIL_LOGIN'),
          pass: this.configService.get('EMAIL_PASSWORD'),
        },
      }),
    );
  }

  async sendMessageAuthorization(user: IMailUser) {
    return await this.mailerService
      .sendMail({
        from: this.configService.get('EMAIL_LOGIN'),
        to: user.email,
        subject: 'Подтверждение регистрации edmed.online ✔',
        html: htmlMessageAuthorization(
          this.configService.get('FRONT_URL'),
          user,
        ),
      })
      .then((result) => {
        return { message: 'Авторизация прошла успешна' };
      })
      .catch(async (e) => {
        await this.userService.deleteById(user._id);
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
