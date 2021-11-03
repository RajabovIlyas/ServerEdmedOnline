import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserToken } from './interfaces/user-token.interface';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private secretOrKey: string;
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<IUserToken>,
    private readonly configService: ConfigService,
  ) {
    this.secretOrKey = configService.get<string>('JWT_SECRET');
  }

  async create(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
    await this.tokenModel.findOneAndDelete({
      user: createUserTokenDto.user,
    });
    const userToken = new this.tokenModel(createUserTokenDto);
    return await userToken.save();
  }

  async delete(token: string) {
    return this.tokenModel
      .deleteOne({ token })
      .exec()
      .then((result) => {
        return { message: 'Токен успешно удален' };
      });
  }

  async deleteAll(user: string): Promise<{ ok?: number; n?: number }> {
    return this.tokenModel.deleteMany({ user });
  }

  async verify(token = '') {
    const bearerToken = token.split(' ')[1];
    const decoded = verify(bearerToken, this.secretOrKey) as any;
    return this.findOne(decoded.id);
  }

  async findOne(token: string): Promise<IUserToken> {
    return await this.tokenModel.findOne({ token }).exec();
  }
}
