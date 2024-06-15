import { client } from "@/lib/aws";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

// This API endpoint will save settings to aws
export async function POST(req: NextRequest) {
  const command = new PutItemCommand({
    TableName: `st-${process.env.ENV}-user`,
    Item: {
      userId: { S: "123" },
      settings: { S: JSON.stringify(req.body) },
    },
  });

  const response = await client.send(command);

  return NextResponse.json({
    status: response.$metadata.httpStatusCode,
  });
}
