import * as mongoose from 'mongoose';

export const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

TokenSchema.index({ token: 1, user: 1 }, { unique: true });
