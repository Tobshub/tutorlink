/** eslint-disable @typescript-eslint/no-unsafe-assignment */
/** eslint-disable @typescript-eslint/no-unsafe-call */
import { env } from "../env.js";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.BEDROCK_ACCESS_KEY_ID,
    secretAccessKey: env.BEDROCK_SECRET_ACCESS_KEY,
  },
});

const modelId = "amazon.titan-embed-text-v2:0";

export const invokeModel = async (inputText: string) => {
  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "*/*",
    body: JSON.stringify({
      inputText,
      dimensions: 512,
      normalize: true,
    }),
  });
  const response = await bedrockClient.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body)) as {
    embedding: number[];
  };
  return body;
};

