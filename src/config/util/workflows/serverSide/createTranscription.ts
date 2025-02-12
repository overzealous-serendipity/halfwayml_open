import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { TranscriptLanguageCode } from "assemblyai";
import {
  MinioService,
  MinioConfig,
} from "@/config/util/services/minio/S3ClientClassMinio";
import { AssemblyAI } from "assemblyai";
import { generateMediaPaths } from "@/lib/utils/pathGenerators";
import { pollingManager } from "@/lib/services/pollingManager";
import { transcriptionPollingService } from "@/lib/services/TranscriptionPollingService";

// Initialize MinIO service
const minioConfig: MinioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  bucket: process.env.MINIO_BUCKET || "media",
  isExternal: true,
};

const minioService = MinioService.create(minioConfig);



interface CreateTranscriptionParams {
  userId: string;
  fileKey: string;
  workspaceId: string;
  languageCode: string;
  fileName: string;
  fileDuration: number;
}

export const createTranscription = async ({
  userId,
  fileKey,
  workspaceId,
  languageCode,
  fileName,
  fileDuration,
}: CreateTranscriptionParams) => {
  try {
    // Create initial transcription record
    const transcription = await prisma.transcription.create({
      data: {
        uuid: uuidv4(),
        title: fileName,
        status: "pending",
        type: "transcription",
        mediaURL: "",
        workspaceId,
        editorId: userId,
        meta: {
          language_code: languageCode || "en",
          duration: fileDuration || 0,
        },
      },
    });

    // Generate proper paths
    const { mediaPath, baseFolder } = generateMediaPaths(
      workspaceId,
      transcription.id,
      fileName
    );

    // Ensure the directory exists (if your MinIO setup requires this)
    await minioService.ensureDirectory(baseFolder);

    // Move file to permanent location with correct path
    await minioService.moveFile(fileKey, mediaPath);

    // Verify file is accessible
    const fileExists = await minioService.verifyFileAccess(mediaPath);
    if (!fileExists) {
      throw new Error("File not accessible after move operation");
    }

    // Get user's AssemblyAI credentials
    const credential = await prisma.credential.findFirst({
      where: {
        userId,
        name: "AssemblyAI",
      },
    });

    if (!credential) {
      throw new Error(
        "No AssemblyAI API key found. Please add your credentials in settings."
      );
    }

    try {
      // Get file buffer from MinIO
      console.log("Getting file buffer from MinIO:", mediaPath);
      const fileBuffer = await minioService.getFileAsBuffer(mediaPath);
      console.log("File buffer size:", fileBuffer.length, "bytes");

      // Initialize AssemblyAI client
      const assemblyClient = new AssemblyAI({
        apiKey: credential.secret,
      });

      // Upload file directly to AssemblyAI
      console.log("Attempting to upload file to AssemblyAI:", {
        fileName,
        bufferSize: fileBuffer.length,
      });

      const uploadUrl = await assemblyClient.files.upload(fileBuffer);
      console.log("File uploaded successfully to AssemblyAI:", {
        uploadUrl,
        fileName,
      });

      // Create transcription using the uploaded file URL
      const transcriptResponse = await assemblyClient.transcripts.transcribe({
        audio: uploadUrl,
        speaker_labels: true,
        language_code: languageCode as TranscriptLanguageCode,
      });

      // First update the transcription status to "processing"
      await prisma.transcription.update({
        where: { id: transcription.id },
        data: {
          mediaURL: mediaPath,
          status: "processing",
          serviceId: transcriptResponse.id,
        },
      });

      // Then explicitly start the polling service
      console.log("[CreateTranscription] Starting polling service for transcription:", transcription.id);
      await transcriptionPollingService.startPolling();
      console.log("[CreateTranscription] Polling service started");

      return {
        transcriptionId: transcription.id,
        message: "Transcription submitted successfully",
      };
    } catch (uploadError) {
      const error = uploadError as Error;
      throw new Error(`AssemblyAI upload failed: ${error.message}`);
    }

  } catch (error) {
    console.error("Transcription creation error:", error);
    throw error;
  }
};
