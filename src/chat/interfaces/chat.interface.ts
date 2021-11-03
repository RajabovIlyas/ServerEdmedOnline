import { Document, Schema } from 'mongoose';
import { IUser } from '../../user/interfaces/user.interface';

export interface IChat extends Document {
  title: string;
  chatPhoto: string;
  created: string | IUser;
  participants: string[] | IUser[];
  dateCreated: Date;
  message: [
    {
      _id: string;
      text: string;
      sender: string | IUser;
      departureDate: Date;
      read: string[];
    },
  ];
}
