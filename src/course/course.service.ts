import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICourse } from './interfaces/course.interface';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private readonly courseModel: Model<ICourse>,
  ) {}

  create(
    idUser: string,
    createCourseDto: CreateCourseDto,
  ): Promise<{ id: any; status: HttpStatus } | void> {
    return this.courseModel
      .create({ ...createCourseDto, idUser })
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

  async getElementByIdAndUser(idCurse: string, idUser: string) {
    return this.courseModel
      .findOne({ _id: idCurse, idUser: idUser })
      .exec()
      .then((value) => {
        if (!value) {
          throw new HttpException(
            `Такого курса не существует или у вас нет доступа!`,
            HttpStatus.METHOD_NOT_ALLOWED,
          );
        }
        return value;
      })
      .catch((err) => {
        throw new HttpException(
          `Ошибка сервера на получение данных!`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  updateCourseAll(course: ICourse) {
    return this.courseModel
      .findByIdAndUpdate(course.id, course)
      .exec()
      .then((value) => {
        return { message: `Данные успешно сохранены!`, status: HttpStatus.OK };
      })
      .catch((err) => {
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async getAll() {
    return this.courseModel.find();
  }
}
