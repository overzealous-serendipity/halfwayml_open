import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  MinioService,
  MinioConfig,
} from "@/config/util/services/minio/S3ClientClassMinio";
import cors from "@/lib/cors";

// Functioniung config
const minioConfig: MinioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucket: process.env.MINIO_BUCKET || 'media',
  isExternal: false,
};


const minioService = MinioService.create(minioConfig);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No valid session found",
      });
    }

    const { fileName, fileUUID, contentType } = req.body;
    if (!fileName || !fileUUID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const fileKey = `tempFiles/${fileUUID}.${fileExtension}`;

    console.log("Generating presigned URL for:", {
      fileKey,
      contentType,
    });

    const uploadUrl = await minioService.generatePresignedUrl(
      fileKey,
      300,
      contentType || "application/octet-stream"
    );
    console.log("Upload URL from the s3Upload api :", uploadUrl);

    const accessUrl = new URL(process.env.PUBLIC_MINIO_ENDPOINT || "");
    accessUrl.pathname = `/${process.env.MINIO_BUCKET}/${fileKey}`;
    console.log("Access URL from the s3Upload api :", accessUrl.toString());
    return res.status(200).json({
      uploadUrl,
      accessUrl: accessUrl.toString(),
      key: fileKey,
    });
  } catch (error) {
    console.error("Error in MinIO upload endpoint:", error);
    return res.status(500).json({
      error: "Failed to generate upload URL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default handler;
