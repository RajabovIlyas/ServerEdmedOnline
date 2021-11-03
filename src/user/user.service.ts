import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { SocialNetworkDto } from '../auth/dto/auth.dto';
import { v4 as uuid } from 'uuid';
import { ChangeUserDto } from './dto/change-user.dto';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { compareSync } from 'bcryptjs';
import { ChangeEmailUserDto } from './dto/change-email-user.dto';
import { UpdatePictureUserDto } from './dto/update-picture-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  create(createUserDto: CreateUserDto): Promise<IUser> {
    return this.userModel.create(createUserDto).catch((err) => {
      if (err.message.indexOf('E11000') !== -1) {
        throw new HttpException(
          `Такой email уже существует!`,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.NOT_FOUND,
        );
      }
    });
  }

  async authorization(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (user.authorization) {
      throw new HttpException(`Не верно введены данные!`, HttpStatus.NOT_FOUND);
    } else {
      return await this.userModel
        .findByIdAndUpdate(id, { authorization: true }, { new: true })
        .exec();
    }
  }

  find(id: string): Promise<IUser> {
    return this.userModel.findById(id).exec();
  }

  async createSocialNetwork(
    socialNetworkDto: SocialNetworkDto,
  ): Promise<IUser> {
    return this.userModel.create({
      ...socialNetworkDto,
      password: await uuid(),
      authorization: true,
    });
  }

  async getByEmail(email: string): Promise<IUser> {
    return this.userModel
      .findOne({ email, authorization: true })
      .select('password')
      .exec();
  }

  async getAuthMe(id: string): Promise<IUser> {
    return await this.userModel.findById(id).exec();
  }

  async getAll(): Promise<IUser | {}> {
    return this.userModel
      .find()
      .populate({
        path: 'role.role',
      })
      .exec();
  }

  async update(
    userId: string,
    changeUserDto: ChangeUserDto,
  ): Promise<IUser | {}> {
    // @ts-ignore
    const result = await this.userModel
      .findByIdAndUpdate(userId, changeUserDto, { new: true })
      .exec();
    return result;
  }

  async updatePassword(
    userId: string,
    changePUDto: ChangePasswordUserDto,
  ): Promise<IUser> {
    const user = await this.userModel
      .findById(userId)
      .select('password')
      .exec();

    if (user?.id && compareSync(changePUDto.oldPassword, user.password)) {
      return this.userModel
        .findByIdAndUpdate(
          userId,
          { password: changePUDto.newPassword },
          { new: true },
        )
        .exec();
    } else {
      throw 404;
    }
  }
  async updateEmail(
    userId: string,
    changeEUDto: ChangeEmailUserDto,
  ): Promise<IUser> {
    const user = await this.userModel
      .findOne({ email: changeEUDto.newEmail })
      .exec();

    if (!user) {
      return this.userModel
        .findByIdAndUpdate(
          userId,
          { email: changeEUDto.newEmail },
          { new: true },
        )
        .exec();
    } else {
      throw 404;
    }
  }

  async deleteById(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  addUrlOnFile(url, nameFile) {
    return process.env.SERVER_URL + `/api/file/${url}/${nameFile}`;
  }

  async updateAvatar(
    userId: string,
    updatePictureUserDto: UpdatePictureUserDto,
  ): Promise<IUser> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { picture: updatePictureUserDto.picture },
        { new: true },
      )
      .exec();
  }

  async updateQualification(
    userId: string,
    updatePictureUserDto: UpdatePictureUserDto,
  ): Promise<IUser> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: {
            confirmationOfQualifications: updatePictureUserDto.picture,
          },
        },
        { new: true },
      )
      .exec();
  }
}
