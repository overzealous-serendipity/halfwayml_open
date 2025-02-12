import type { NextApiRequest, NextApiResponse } from "next";
import { MinioService, MinioConfig } from "@/config/util/services/minio/S3ClientClassMinio";
import { ConversionService } from "@/config/util/functions/conversion/conversionService";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { SubtitlePreferences } from "@/types/workspace";


// Update default subtitle preferences to match SubtitlePreferences interface
const defaultSubtitlePreferences: SubtitlePreferences = {
  subtitleStyle: 1, // Default style number
  parameters: {
    cpl: 42,              // characters per line (was lineLength)
    gap: 0.2,            // was minimumGap
    cps: 20,             // characters per second (new required field)
    minDuration: 1.0,    // was minimumDuration
    maxDuration: 7.0,    // was maximumDuration
  }
};

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

// Add interface for metadata structure
interface WorkspaceMetadata {
  subtitlePreferences?: typeof defaultSubtitlePreferences;
}

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

  try {
    const { formatType, docTitle, fileURL, workspaceId } = req.body;

    // Validate required fields
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    if (!fileURL) {
      return res.status(400).json({ error: "File URL is required" });
    }

    if (!formatType) {
      return res.status(400).json({ error: "Format type is required" });
    }

    // Get workspace and preferences using Prisma
    const workspace = await prisma.workspace.findUnique({
      where: { 
        id: workspaceId 
      },
      select: {
        metaData: true,
        users: {
          where: { 
            email: session.user.email 
          }
        },
      },
    });

    // Check workspace access
    if (!workspace || workspace.users.length === 0) {
      return res.status(403).json({ error: "Access denied to workspace" });
    }

    // Type assertion for metadata
    const preferences = ((workspace.metaData as WorkspaceMetadata)?.subtitlePreferences) || defaultSubtitlePreferences;

    // Use the new method to get version content directly
    const content = await minioService.getVersionFileContent(fileURL);

    // Convert content with preferences
    const conversionResult = await ConversionService.convert(
      content,
      formatType,
      docTitle || 'untitled',
      preferences 
    );

    // Set appropriate MIME type
    const mimeTypes = {
      srt: "text/plain",
      txt: "text/plain",
      vtt: "text/plain",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pdf: "application/pdf",
      json: "application/json",
      csv: "text/csv",
    };

    const fileExtension = formatType.toLowerCase() as keyof typeof mimeTypes;
    const mimeType = mimeTypes[fileExtension] || "text/plain";

    // Set response headers
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${docTitle || 'untitled'}.${fileExtension}"`
    );

    // Send response
    if (typeof conversionResult === "string") {
      res.send(conversionResult);
    } else {
      const buffer = Buffer.from(await conversionResult.arrayBuffer());
      res.send(buffer);
    }

    // Log the conversion in EventLog
    await prisma.eventLog.create({
      data: {
        entityId: workspaceId,
        entityType: "transcription",
        eventType: "convert",
        eventDetails: `Converted to ${formatType} format: ${docTitle || 'untitled'}`,
      },
    });

  } catch (error) {
    console.error("Conversion error:", error);
    const e = error as Error;
    res.status(500).json({
      error: e.message || "An error occurred during the conversion process.",
    });
  }
}
