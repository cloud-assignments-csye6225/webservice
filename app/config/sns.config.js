const AWS = require('aws-sdk');

AWS.config.region = process.env.AWS_BUCKET_REGION;
AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 5000 },
    maxRetries: 10,
    retryDelayOptions: { base: 200 },
});

const publishTextPromise = new AWS.SNS({
    credentials: AWS.config.credentials,
    region: AWS.config.region
});

const sns = {};
sns.publishTextPromise = publishTextPromise;

module.exports = sns;