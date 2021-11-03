import { Schema } from 'mongoose';
import { currencyEnum } from '../enums/currency.enum';
import * as fs from 'fs';

export const CourseSchema = new Schema({
  idUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  banner: {
    backgroundImg: { type: String, default: ' ' },
    title: { type: String, required: true },
    speakerName: { type: String, required: true },
    speakerShortDescription: { type: String, required: true },
  },
  mainContent: {
    type: {
      youWillLearn: {
        type: {
          title: { type: String, required: true },
          content: { type: String, required: true },
        },
        required: true,
      },
      eventProgram: {
        type: {
          title: { type: String, required: true },
          content: { type: String, required: true },
        },
        required: true,
      },
      vebinars: [
        {
          promoImg: { type: String, required: true, default: '' },
          format: { type: String, required: true },
          date: { type: Date, default: Date.now() },
          isPaid: { type: Boolean, default: false, required: true },
          cost: { type: Number, default: 0, min: 0 },
          currency: {
            type: String,
            enum: Object.values(currencyEnum),
            default: currencyEnum.RUB,
          },
          promoCode: { type: String },
          video: { type: String, required: true },
          videoDuration: { type: Number, required: true },
          title: { type: String, required: true },
          content: { type: String, required: true },
          personalDiscount: { type: Number, default: 0, min: 0, max: 100 },
        },
      ],
      fullCoursePayCard: {
        type: {
          cost: { type: Number, default: 0, min: 0 },
          currency: {
            type: String,
            enum: Object.values(currencyEnum),
            default: currencyEnum.RUB,
          },
          discount: { type: Number, default: 0, min: 0, max: 100 },
          costWithDiscount: { type: Number, default: 0, min: 0 },
          promoCodeDiscount: { type: String },
        },
        required: true,
      },
    },
    required: true,
  },
  aboutSpeaker: {
    type: {
      img: { type: String, required: true, default: '' },
      fullName: { type: String, required: true },
      career: { type: String, required: true },
      description: { type: String, required: true },
    },
    required: true,
  },
});

const checkPicture = async (str: string) => {
  const fileNameWithPath = 'uploads/picture/' + str;
  try {
    if (fs.existsSync(fileNameWithPath)) {
      return process.env.SERVER_URL + `/api/file/picture/${str}`;
    }
  } catch (e) {
    console.log('err', e.message);
  }
  return str;
};

async function getData(result) {
  if (!result) {
    return result;
  }
  result.banner.backgroundImg = await checkPicture(result.banner.backgroundImg);

  result.aboutSpeaker.img = await checkPicture(result.aboutSpeaker.img);
  return {
    ...result,
    mainContent: {
      ...result.mainContent,
      vebinars: result.mainContent.vebinars.map(async (value) => {
        const promoImg = await checkPicture(value.promoImg);
        value.promoImg = promoImg;
        return value;
      }),
    },
  };
}

function getDataArray(results) {
  return results.map((result) => getData(result));
}
CourseSchema.post('findOneAndUpdate', getData);

CourseSchema.post('findOne', getData);
CourseSchema.post('find', getDataArray);
