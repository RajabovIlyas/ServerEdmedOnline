import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChat } from './interfaces/chat.interface';
import { CreateChatDto } from './dto/create.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { IChatMenu } from './interfaces/chat-menu.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat')
    private readonly chatModel: Model<IChat>,
  ) {}

  async create(create: CreateChatDto) {
    return this.chatModel
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

  async addMessage(idChat: string, idUser: string, message: CreateMessageDto) {
    return this.chatModel
      .findOneAndUpdate(
        { _id: idChat, participants: idUser },
        { $push: { message: message } },
        { new: true },
      )
      .select('message')
      .populate({
        path: 'message.sender',
        select: 'firstName lastName picture',
      })
      .exec()
      .then((value) => {
        return value.message[value.message.length - 1];
      })
      .catch((err) => {
        throw new HttpException(
          `Не верно введены данные!`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async readMessage(idChat: string, idUser: string, idMessages: string[]) {
    const data = await this.chatModel.findOne({
      _id: idChat,
      participants: idUser,
    });
    const indexArray = [];
    for (const idMessage of idMessages) {
      indexArray.push(
        await data.message.findIndex(
          (value) => String(value._id) === String(idMessage),
        ),
      );
    }
    for (const index of indexArray) {
      if (Array.isArray(data.message) && index !== -1) {
        await data.message[index].read.push(idUser);
      }
    }
    await data.save();
  }

  async getChats(idUser: string, page = 1, max = 10) {
    return this.chatModel
      .find({ participants: idUser }, undefined, {
        lean: true,
      })
      .select('title chatPhoto participants')
      .populate({ path: 'participants', select: 'firstName lastName' })
      .exec();
  }

  async findRoom(idChat: string, idUser: string) {
    return this.chatModel.findOne({ _id: idChat, participants: idUser }).exec();
  }

  async getUsersInRoom(idChat: string, idUser: string) {
    return this.chatModel
      .findOne({ _id: idChat, participants: idUser })
      .exec()
      .then((value) => {
        const idUsers = [];
        for (const userId of value.participants) {
          if (String(userId) !== String(idUser)) {
            idUsers.push(userId);
          }
        }
        return idUsers;
      });
  }

  async getAldMessage(
    idChat: string,
    idUser: string,
    idBeforeMessage: string,
    max = 20,
  ) {
    return this.chatModel
      .findOne({ _id: idChat, participants: idUser }, undefined, {
        lean: true,
        sort: { 'message.departureDate': 1 },
      })
      .select('message')
      .populate({
        path: 'message.sender',
        select: 'firstName lastName picture',
      })
      .exec()
      .then(async (value) => {
        const index = await value.message.findIndex(
          (value1) => String(value1._id) === String(idBeforeMessage),
        );
        const indexStart = 0 >= index - max ? 0 : index - max;
        console.log(
          'index',
          index,
          indexStart,
          value.message.length,
          idBeforeMessage,
        );
        return value.message.slice(indexStart, index);
      });
  }

  async getMessage(idChat: string, idUser: string, page = 1, max = 10) {
    return this.chatModel
      .findOne({ _id: idChat, participants: idUser }, undefined, {
        lean: true,
        sort: { 'message.departureDate': 1 },
      })
      .select('message')
      .populate({
        path: 'message.sender',
        select: 'firstName lastName picture',
      })
      .exec()
      .then((value) => {
        return value.message
          .reverse()
          .slice(
            (page - 1) * max,
            value.message.length < page * max
              ? value.message.length
              : max * page,
          )
          .reverse();
      });
  }

  async messageNotificationCount(idUser: string) {
    return this.chatModel
      .find({ participants: idUser }, undefined, { lean: true })
      .exec()
      .then((result) => {
        let count = 0;
        for (const value of result) {
          for (const message of value.message) {
            if (Array.isArray(message.read)) {
              let index = -1;
              for (const read of message.read) {
                if (String(read) === String(idUser)) {
                  index = message.read.indexOf(read);
                }
              }
              if (String(message.sender) !== String(idUser) && index === -1) {
                count++;
              }
            } else if (String(message.sender) !== String(idUser)) {
              count++;
            }
          }
        }
        return count;
      });
  }

  async messagesForUser(idUser: string, page: number, size: number) {
    return await this.chatModel
      .find({ participants: idUser }, undefined, { lean: true })
      .select('title message chatPhoto participants')
      .populate({
        path: 'message.sender participants',
        select: 'firstName lastName picture',
      })
      .exec()
      .then(async (result) => {
        await Promise.all(
          result.sort((a: IChat, b: IChat) => {
            const date1 =
              b?.message?.length <= 0
                ? b?.dateCreated
                : b?.message[b?.message.length - 1]?.departureDate;
            const date2 =
              a?.message?.length <= 0
                ? a?.dateCreated
                : a?.message[a?.message.length - 1]?.departureDate;
            console.log(date1.getTime() < date2.getTime());
            return date1.getTime() >= date2.getTime() ? 1 : -1;
          }),
        );
        return await Promise.all(
          result.map(async (value) => {
            let count = 0;
            for (const message of value.message) {
              if (Array.isArray(message.read)) {
                let index = -1;
                for (const read of message.read) {
                  if (String(read) === String(idUser)) {
                    index = message.read.indexOf(read);
                  }
                }
                if (String(message.sender) !== String(idUser) && index === -1) {
                  count++;
                }
              } else if (String(message.sender) !== String(idUser)) {
                count++;
              }
            }
            return {
              ...value,
              message: value.message[value.message.length - 1],
              dontReadMessageCount: count,
            };
          }),
        );
      });
  }
}
