import { Schema } from 'mongoose';

export const PostSchema = new Schema({
  createdCommunity: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Community',
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
    required: true,
  },
  pages: {
    type: [String],
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User',
  },
  comments: {
    type: [
      {
        dateAdded: {
          type: Date,
          default: Date.now(),
        },
        text: {
          type: String,
          required: true,
        },
        sender: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    required: true,
  },
});
