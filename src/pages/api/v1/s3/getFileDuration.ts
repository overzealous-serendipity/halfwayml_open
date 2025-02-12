// import type { NextApiRequest, NextApiResponse } from "next";
// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// type Data = {};

// const accessKeyId = process.env.A_AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.A_AWS_SECRET_ACCESS_KEY;

// if (!accessKeyId || !secretAccessKey) {
//   throw new Error("AWS credentials are not set");
// }

// const lambdaClient = new LambdaClient({
//   region: process.env.A_AWS_REGION,
//   credentials: {
//     accessKeyId,
//     secretAccessKey,
//   },
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   const params = {
//     FunctionName: "halfwayml_getFileDuration",
//     Payload: JSON.stringify(req.body),
//   };

//   try {
//     const lambdaResponse = await lambdaClient.send(new InvokeCommand(params));
//     // Convert Uint8Array to string
//     if (!lambdaResponse.Payload) {
//       throw new Error("Lambda response payload is empty");
//     }
//     const payloadString = Buffer.from(lambdaResponse.Payload).toString("utf-8");
//     const lambdaResult = JSON.parse(payloadString);
//     res.status(200).json(lambdaResult);
//   } catch (error) {
//     const e = error as Error;
//     res.status(500).json({
//       error: "Error invoking lambda function",
//       details: e.message,
//     });
//   }
// }
