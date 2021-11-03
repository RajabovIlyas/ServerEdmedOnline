import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { roleEnum } from '../enums/role.enum';
import { genderEnum } from '../enums/gender.enum';
import * as fs from 'fs';

const toLower = (v) => {
  return v.toLowerCase();
};

export const UserSchema = new mongoose.Schema({
  email: { type: String, set: toLower, required: true },
  picture: { type: String, default: 'default.jpg', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true, select: false },
  authorization: { type: Boolean, default: false },
  role: {
    type: String,
    enum: Object.values(roleEnum),
    default: 'User',
    required: true,
  },
  //
  profession: String,
  academicDegrees: String,
  patronymic: String,
  confirmationOfQualifications: [String],
  dateOfBirth: Date,
  city: String,
  gender: {
    type: String,
    enum: Object.values(genderEnum),
  },
  phoneNumber: String,
  confidentialityOfPersonalData: String,
  //
  url: String,
  urlTwitter: String,
  urlFacebook: String,
  urlLinkedin: String,
  urlYoutube: String,
});

UserSchema.pre('save', function (next) {
  const user: any = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const user: any = this.getUpdate();
  if (!user.password) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

function getData(result) {
  if (!result) {
    return result;
  }
  if (!result.picture) {
    result.picture = process.env.SERVER_URL + `/api/file/avatar/default.jpg`;
  } else if (result.picture.indexOf('http') !== 0) {
    const fileNameWithPath = 'uploads/avatar/' + result.picture;
    if (fs.existsSync(fileNameWithPath)) {
      result.picture =
        process.env.SERVER_URL + `/api/file/avatar/${result.picture}`;
    } else {
      result.picture = process.env.SERVER_URL + `/api/file/avatar/default.jpg`;
    }
  }
}
UserSchema.post('findOneAndUpdate', getData);

UserSchema.post('findOne', getData);

UserSchema.index({ email: 1 }, { unique: true });
