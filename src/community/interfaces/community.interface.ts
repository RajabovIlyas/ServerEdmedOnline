import { Document, Schema } from 'mongoose';
import { IUser } from '../../user/interfaces/user.interface';

export interface ICommunity extends Document {
  creator: string | IUser;
  followers: string[] | IUser[];
  communityPhoto: string;
  title: string;
  description: string;
  discussions: [
    {
      title: string;
      chat: string | any;
    },
  ];
}
