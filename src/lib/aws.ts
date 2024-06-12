import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const clientConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
};
export const client = new DynamoDBClient(clientConfig);
