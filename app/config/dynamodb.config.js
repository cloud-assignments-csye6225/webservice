const AWS = require("aws-sdk");

AWS.config.region = process.env.REGION;
AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 5000 },
    maxRetries: 10,
    retryDelayOptions: { base: 200 },
});

const dynamoDBClient = new AWS.DynamoDB({
    credentials: AWS.config.credentials,
    region: AWS.config.region,
});

const dynamo = {};
dynamo.dynamoDBClient = dynamoDBClient;

module.exports = dynamo;
