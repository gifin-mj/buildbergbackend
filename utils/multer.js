// utils/upload.js

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Local disk storage (temp)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp-uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Upload to S3 manually
async function uploadToS3(file) {
  const fileStream = fs.createReadStream(file.path);

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `gallery/${Date.now()}_${file.originalname}`,
      Body: fileStream,
      ContentType: file.mimetype,
      ACL: 'public-read',
    },
  });

  const result = await upload.done();

  // Optionally delete temp file
  fs.unlinkSync(file.path);

  return result.Location; // Public URL
}

async function uploadMultipleToS3(files) {
  const uploadedFiles = [];

  for (const file of files) {
    const fileStream = fs.createReadStream(file.path);
    const key = `gallery/${Date.now()}_${file.originalname}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
        ACL: 'public-read',
      },
    });

    const result = await upload.done();
    uploadedFiles.push({ url: result.Location, key });

    // Clean up local file
    fs.unlinkSync(file.path);
  }

  return uploadedFiles;
}

module.exports = {
  upload,      // multer middleware
  uploadToS3,
  uploadMultipleToS3  // function to call in route handler
};
