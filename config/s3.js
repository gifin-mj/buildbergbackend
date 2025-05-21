const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS with credentials and region
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // from your AWS IAM user
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,                 // e.g., 'ap-south-1'
});

module.exports = s3;