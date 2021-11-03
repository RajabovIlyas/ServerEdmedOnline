import { Document, Schema } from 'mongoose';
import { IUser } from '../../user/interfaces/user.interface';
import { ICommunity } from '../../community/interfaces/community.interface';

export interface IPost extends Document {
  dateAdded: Date;
  text: string;
  pages: string[];
  likes: string[] | IUser[];
  createdCommunity: string | ICommunity;
  comments: [
    {
      dateAdded: Date;
      text: string;
      sender: string;
    },
  ];
}
