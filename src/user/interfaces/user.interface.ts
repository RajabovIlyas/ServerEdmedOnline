import { Document } from 'mongoose';
import { genderEnum } from '../enums/gender.enum';
import { roleEnum } from '../enums/role.enum';

export interface IUser extends Document {
  email: string;
  picture: string;
  lastName: string;
  firstName: string;
  password: string;
  authorization: boolean;
  role: roleEnum;
  //
  profession: string;
  academicDegrees: string;
  patronymic: string;
  confirmationOfQualifications: string[]; //Подтверждение квалификации
  dateOfBirth: string;
  city: string;
  gender: genderEnum;
  phoneNumber: string;
  confidentialityOfPersonalData: string; //конфиденциальность личных данных
  //
  //
  url: string;
  urlTwitter: string;
  urlFacebook: string;
  urlLinkedin: string;
  urlYoutube: string;
}
