import { NextApiRequest, NextApiResponse } from "next";
import {
  MinioConfig,
  MinioService,
} from "@/config/util/services/minio/S3ClientClassMinio";

if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
  throw new Error("Missing MINIO_ACCESS_KEY or MINIO_SECRET_KEY");
}

const minioConfig: MinioConfig = {
  endPoint: "localhost",

  port: parseInt("9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  bucket: process.env.MINIO_BUCKET || "media",
  isExternal: false,
};

const minioService = MinioService.create(minioConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { workspaceId, transcriptionId, uuid } = req.body;
  const keyPath = `workspaces/${workspaceId}/transcriptions/${transcriptionId}/transcriptions/${uuid}-version.json`;
  try {
    const uploadURL = await minioService.generatePresignedUrl(
      keyPath,
      60 * 60 * 5, // 5 hours
      "application/json"
    );

    const accessURL = new URL(process.env.PUBLIC_MINIO_ENDPOINT || "");
    accessURL.pathname = `/${process.env.MINIO_BUCKET}/${keyPath}`;

    res.status(200).json({ uploadURL, accessURL, fileKey: keyPath });
  } catch (error) {
    res.status(500).json({ error: "Error generating URL" });
  }
}
