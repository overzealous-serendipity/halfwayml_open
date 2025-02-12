import { NextApiRequest, NextApiResponse } from "next";
import {
  MinioService,
  MinioConfig,
} from "@/config/util/services/minio/S3ClientClassMinio";

const minioConfig: MinioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  bucket: process.env.MINIO_BUCKET || "media",
  isExternal: true,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const fullPath = req.query.id as string;
    console.log("Requested media path:", fullPath);

    const minioService = MinioService.create(minioConfig);
    const mediaBuffer = await minioService.getObject(fullPath);

    // Get content type based on file extension
    console.log("Here is the full path: ", fullPath);
    const contentType = fullPath.endsWith(".mp4") ? "video/mp4" : "audio/mpeg";
    console.log("Here is the content type: ", contentType);

    // Set appropriate headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", mediaBuffer.length);

    return res.status(200).send(mediaBuffer);
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({
      message: "Error fetching media",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
