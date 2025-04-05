import AWS from 'aws-sdk';
import multer from 'multer';
import { throwError } from './throwError';
import httpStatus from './httpStatus';
import { USER_MESSAGES } from '@modules/user/user.enum';

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION || 'us-east-1',
});

 export const upload = multer({
   storage : multer.memoryStorage(), 
   limits: { fileSize: 5 * 1024 * 1024 } 
  });

 export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
    return cb(throwError(httpStatus.BAD_REQUEST, USER_MESSAGES.ONLY_PDF_FILES_ALLOWED));
    }
    cb(null, true); 
  },
});

 export const uploadProfilePictureToS3 = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.BUCKET_NAME || 'squadra-media',
      Key: `profile-pictures/${Date.now}-${file.originalname}`, 
      Body: file.buffer,
      ContentType: file.mimetype, 
      Metadata: { 'x-amz-meta-title': file.originalname },
      ACL: 'public-read'
    };
    s3.upload(params, (err: any, data: { Location: string | PromiseLike<string>; }) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

export const uploadResumeToS3 = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.mimetype !== 'application/pdf') {
      return reject(throwError(httpStatus.BAD_REQUEST, USER_MESSAGES.ONLY_PDF_FILES_ALLOWED));
    }

    const params = {
      Bucket: process.env.BUCKET_NAME || '',
      Key: `resumes/${Date.now()}-${file.originalname}`, 
      Body: file.buffer, 
      ContentType: file.mimetype, 
      Metadata: { 'x-amz-meta-title': file.originalname }, 
      ACL: 'public-read', 
    };

    s3.upload(params, (err: any, data: { Location: string | PromiseLike<string>; }) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); 
      }
    });
  });
};

module.exports = { uploadProfilePictureToS3 ,uploadResumeToS3, upload,uploadResume};