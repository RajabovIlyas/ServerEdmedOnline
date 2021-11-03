import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<IPost>,
  ) {}

  async addPost(post: CreatePostDto) {
    return this.postModel
      .create(post)
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

  deletePost(idPost: string) {
    return this.postModel
      .findByIdAndDelete(idPost)
      .exec()
      .then((value) => {
        return { id: value.id, status: HttpStatus.NO_CONTENT };
      })
      .catch((err) => {
        console.log('err', err);
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async setLike(idUser: string, idPost: string) {
    try {
      const post = await this.postModel
        .findOne({ _id: idPost, likes: idUser })
        .exec();
      console.log('post', post);
      if (post) {
        const result = await this.postModel
          .findOneAndUpdate(
            { _id: idPost, likes: idUser },
            { $pull: { likes: idUser } },
            { new: true },
          )
          .exec();
        return { id: result.id, status: HttpStatus.NO_CONTENT };
      } else {
        console.log('im here');
        const result = await this.postModel
          .findOneAndUpdate(
            { _id: idPost },
            { $push: { likes: idUser } },
            { new: true },
          )
          .exec();
        return { id: result._id, status: HttpStatus.NO_CONTENT };
      }
    } catch (e) {
      console.log('error', e);
      throw new HttpException(
        `Не верно введены данные!`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addComment(idPost: string, comment: CreateCommentDto) {
    return this.postModel
      .findByIdAndUpdate(idPost, { $push: { comments: comment } })
      .exec()
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

  async removeComment(idPost, idComment) {
    return this.postModel
      .findOneAndUpdate(
        { _id: idPost, 'comments._id': idComment },
        {
          $pull: { comments: { _id: idComment } },
        },
      )
      .exec()
      .then((value) => {
        return { id: value._id, status: HttpStatus.NO_CONTENT };
      })
      .catch((err) => {
        console.log('error', err);
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getPostByCommunity(
    idCommunity: string,
    idUser: string,
    page = 1,
    max = 10,
  ) {
    return this.postModel
      .find({ createdCommunity: idCommunity }, undefined, {
        skip: (page - 1) * max,
        limit: max,
        lean: true,
      })
      .populate({ path: 'createdCommunity', select: 'title communityPhoto' })
      .exec()
      .then((value) =>
        value.map((value1) => {
          return {
            ...value1,
            likes: value1.likes.length,
            comments: value1.comments.length,
            likeSelect: value1.likes.some(
              (value2) => value2.toString() === idUser.toString(),
            ),
          };
        }),
      );
  }

  async getComment(idPost: string, page = 1, max = 10) {
    return this.postModel
      .findById(idPost, undefined, {
        lean: true,
      })
      .populate({
        path: 'comments.sender',
        select: 'firstName lastName picture',
      })
      .exec()
      .then((value) => {
        if (value) {
          return value.comments;
        }
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async whoLike(idPost: string, page = 1, max = 10) {
    return this.postModel
      .findById(idPost, undefined, {
        lean: true,
      })
      .populate({ path: 'likes', select: 'firstName lastName picture' })
      .exec()
      .then((value) => {
        if (value) {
          return value.likes;
        }
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getById(id: string) {
    return this.postModel.findById(id);
  }
}
