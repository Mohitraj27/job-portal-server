import AWS from 'aws-sdk';
import multer from 'multer';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

 export const upload = multer({ storage : multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

 export const uploadProfilePictureToS3 = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || 'squadra-media',
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



module.exports = { uploadProfilePictureToS3 , upload};