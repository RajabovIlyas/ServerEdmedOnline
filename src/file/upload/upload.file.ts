import { Request } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';

const fileFilterImg = (req: Request, file: any, cb: any) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileFilterPdf = (req: Request, file: any, cb: any) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadAvatar = {
  limits: {
    fileSize: 10240 * 10240 * 5,
  },
  fileFilterImg,
  storage: diskStorage({
    destination: 'uploads/avatar/',
    filename: (req, file, cb) => {
      const filename: string = uuidV4();
      const extension: string[] = file.originalname.split('.');
      cb(null, `${filename}.${extension[extension.length - 1]}`);
    },
  }),
};

export const uploadPicture = {
  limits: {
    fileSize: 10240 * 10240 * 5,
  },
  fileFilterImg,
  storage: diskStorage({
    destination: 'uploads/picture/',
    filename: (req, file, cb) => {
      const filename: string = uuidV4();
      const extension: string[] = file.mimetype.split('/');
      cb(null, `${filename}.${extension[extension.length - 1]}`);
    },
  }),
};

export const uploadQualifications = {
  storage: diskStorage({
    destination: 'uploads/Qualifications/',
    filename: (req, file, cb) => {
      const filename: string = uuidV4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};
