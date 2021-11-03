import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create.community.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICommunity } from './interfaces/community.interface';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel('Community')
    private readonly communityModel: Model<ICommunity>,
  ) {}

  async create(create: CreateCommunityDto) {
    return this.communityModel
      .create(create)
      .then((value) => {
        return { id: value.id, status: HttpStatus.CREATED };
      })
      .catch((err) => {
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async checkCreator(idUser: string, idCommunity) {
    return this.communityModel
      .findOne({ _id: idCommunity, creator: idUser })
      .exec()
      .then((value) => {
        if (!value) {
          throw new HttpException(
            `Данное действие запрещен для данного пользователя!`,
            HttpStatus.UNAUTHORIZED,
          );
          return value;
        }
      })
      .catch((err) => {
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getById(id: string) {
    return this.communityModel.findById(id).exec();
  }
}
