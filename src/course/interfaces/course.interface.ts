import { Document } from 'mongoose';

export interface ICourseTD {
  readonly title: string;
  readonly content: string;
}

export interface IWebinar {
  promoImg: string;
  format: string;
  date: Date;
  isPaid: boolean;
  cost: number;
  currency: string;
  promoCode: string;
  video: string;
  videoDuration: number;
  title: string;
  content: string;
  personalDiscount: number;
}

export interface IFullCoursePayCard {
  cost: number;
  currency: string;
  discount: number;
  costWithDiscount: number;
  promoCodeDiscount: string;
}

export interface IMainContent {
  youWillLearn: ICourseTD;
  eventProgram: ICourseTD;
  vebinars: IWebinar[];
  fullCoursePayCard: IFullCoursePayCard;
}

export interface IAboutSpeaker {
  img: string;
  fullName: string;
  career: string;
  description: string;
}

export interface IBanner {
  backgroundImg: string;
  title: string;
  speakerName: string;
  speakerShortDescription: string;
}

export interface ICourse extends Document {
  idUser: string;
  banner: IBanner;
  mainContent: IMainContent;
  aboutSpeaker: IAboutSpeaker;
}
