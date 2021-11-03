import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CommunitySchema = new mongoose.Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  followers: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User',
  },
  communityPhoto: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discussions: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        chat: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Chat',
        },
      },
    ],
    required: true,
  },
});
