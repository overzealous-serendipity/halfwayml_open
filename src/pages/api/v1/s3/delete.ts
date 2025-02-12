import type { NextApiRequest, NextApiResponse } from "next";
import { MinioService, MinioConfig } from "@/config/util/services/minio/S3ClientClassMinio";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// MinIO configuration
const minioConfig: MinioConfig = {
  endPoint: "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
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
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fileKey } = req.body;

  if (!fileKey) {
    return res.status(400).json({ error: "File key is required" });
  }

  try {
    // Verify file exists before attempting deletion
    const exists = await minioService.objectExists(fileKey);
    if (!exists) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the object
    await minioService.removeObject(fileKey);
    
    console.log("File deleted successfully:", {
      fileKey,
      bucket: minioConfig.bucket
    });


    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    const e = error as Error;
    res.status(500).json({ 
      error: "Error deleting file", 
      message: e.message 
    });
  }
}
