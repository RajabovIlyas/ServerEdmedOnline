import { Schema } from 'mongoose';

export const ChatSchema = new Schema({
  title: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  chatPhoto: {
    type: String,
  },
  created: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  participants: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User',
  },
  message: {
    type: [
      {
        text: {
          type: String,
          required: true,
        },
        sender: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        read: {
          type: [Schema.Types.ObjectId],
          required: true,
          ref: 'User',
        },
        departureDate: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    required: true,
  },
});
