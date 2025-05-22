const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3.send(command);
    console.log(`✅ Deleted ${key} from S3`);
  } catch (err) {
    console.error(`❌ Error deleting ${key} from S3:`, err);
  }
}

module.exports = { deleteFromS3 };
