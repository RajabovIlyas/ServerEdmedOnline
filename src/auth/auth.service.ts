import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { CreateUserTokenDto } from '../token/dto/create-user-token.dto';
import { SignOptions } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { LoginDto, SignUpDto, SocialNetworkDto } from './dto/auth.dto';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async createToken(id: string) {
    const token = await this.tokenService.create({
      user: id,
      token: await uuid(),
    });
    const payload = {
      id: token.token,
      type: 'access',
    };
    return { token: await this.generateToken(payload) };
  }

  async logIn(auth: LoginDto) {
    const findUser = await this.userService.getByEmail(auth.email);
    if (findUser?.id && compareSync(auth.password, findUser.password)) {
      return this.createToken(findUser.id);
    } else {
      throw new HttpException(`Не соответвуют данные!`, HttpStatus.NOT_FOUND);
    }
  }

  async socialNetworkLogin(socialNetworkDto: SocialNetworkDto) {
    if (!socialNetworkDto) {
      return 'No user from google';
    }
    const findUser = await this.userService.getByEmail(socialNetworkDto.email);
    if (findUser?.id) {
      return this.createToken(findUser.id);
    } else {
      const user = await this.userService.createSocialNetwork(socialNetworkDto);
      return this.createToken(user.id);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    return await this.userService.create(signUpDto).then(async (result) => {
      return await this.mailService.sendMessageAuthorization({
        _id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      });
    });
  }

  async authMe(id: string) {
    return await this.userService.getAuthMe(id);
  }

  async logout(id: string) {
    return await this.tokenService.delete(id);
  }

  private async generateToken(data, options?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token): Promise<any> {
    try {
      const data = this.jwtService.verify(token);
      const tokenExists = await this.tokenService.findOne(data._id);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async authorization(id: string) {
    return this.userService.authorization(id).then((result) => {
      return this.createToken(result.id);
    });
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto) {
    const userToken = await this.tokenService.create(createUserTokenDto);
    return userToken;
  }
}
