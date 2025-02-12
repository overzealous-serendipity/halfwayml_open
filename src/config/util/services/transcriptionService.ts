import { prisma } from "@/lib/prisma";
import { AssemblyAI } from "assemblyai";
import {
  MinioService,
  MinioConfig,
} from "@/config/util/services/minio/S3ClientClassMinio";
import { generateMediaPaths } from "@/lib/utils/pathGenerators";
import { transcriptionPollingService } from "@/lib/services/TranscriptionPollingService";
import { pollingManager } from "@/lib/services/pollingManager";

if (typeof window !== "undefined") {
  throw new Error("TranscriptionService can only be used on the server side");
}

const minioConfig: MinioConfig = {

  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  bucket: process.env.MINIO_BUCKET || "media",
  isExternal: true,
};

export class TranscriptionService {
  private client: AssemblyAI;
  private minioService: MinioService;
  private transcriptionId: string;

  constructor(apiKey: string, transcriptionId: string) {
    this.client = new AssemblyAI({ apiKey });
    this.minioService = MinioService.create(minioConfig);
    this.transcriptionId = transcriptionId;
  }

  private async saveTranscriptionContent(
    transcriptData: any,
    assemblyTranscriptId: string
  ) {
    console.log(
      "[TranscriptionService] Saving content for:",
      this.transcriptionId
    );

    try {
      // Get transcription record to get workspaceId
      const transcription = await prisma.transcription.findUnique({
        where: { id: this.transcriptionId },
        select: { workspaceId: true, title: true },
      });
      console.log(
        "Transcription record from the transcription service:",
        transcription
      );

      if (!transcription) {
        throw new Error("Transcription not found");
      }

      // Use the same path generator as the upload
      const { contentPath } = generateMediaPaths(
        transcription.workspaceId,
        this.transcriptionId,
        transcription.title
      );
      console.log("Content path from the transcription service:", contentPath);

      const { text, confidence, words, utterances, language_code } =
        transcriptData;

      // Create content object with new structure
      const content = {
        document: {
          utterances: this.mapUtterances(utterances),
        },
        meta: {
          metData: {
            name: transcription.title,
            type: "transcription",
            confidence,
            idService: assemblyTranscriptId,
            itemIdOwn: this.transcriptionId,
            language_code,
            status: "completed",
            text,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          eventsLog: [
            {
              event: "Transcription created",
              timestamp: new Date(),
            },
          ],
          exportPreferences: {},
        },
      };

      // Save content to MinIO
      const contentBuffer = Buffer.from(JSON.stringify(content, null, 2));

      console.log("[TranscriptionService] Saving to MinIO:", contentPath);
      await this.minioService.putObject(contentPath, contentBuffer);
      console.log("[TranscriptionService] Saved to MinIO successfully");

      // Update transcription record
      await prisma.transcription.update({
        where: { id: this.transcriptionId },
        data: {
          content,
          status: "completed",
          serviceId: assemblyTranscriptId,
          lastVersionURL: contentPath,
        },
      });
      console.log("[TranscriptionService] Database updated successfully");
    } catch (error) {
      console.error("[TranscriptionService] Error saving content:", error);
      throw error;
    }
  }

  private mapUtterances(utterances: any[]): any[] {
    return utterances.map((item) => ({
      comments: [],
      reviewed: false,
      confidence: item.confidence,
      end: item.end,
      speaker: item.speaker,
      start: item.start,
      bodyText: item.text,
      type: "paragraph",
      children: item.words?.map((word: any) => ({
        text: word.text,
        confidence: word.confidence,
        end: word.end,
        speaker: word.speaker,
        start: word.start,
        type: "text",
        bold: false,
        italic: false,
        underline: false,
        highlight: false,
        reviewed: false,
      })),
    }));
  }

  public async processTranscription(transcript: any) {
    try {
      if (transcript.status === "completed") {
        await this.saveTranscriptionContent(transcript, transcript.id);
        return true;
      }

      if (transcript.status === "error") {
        await prisma.transcription.update({
          where: { id: this.transcriptionId },
          data: { status: "failed" },
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error processing transcription:", error);
      throw error;
    }
  }

  async createTranscription(audioUrl: string): Promise<any> {
    try {
      const transcript = await this.client.transcripts.transcribe({
        audio: audioUrl,
        speaker_labels: true,
      });

      await pollingManager.startPollingIfNeeded();

      return transcript;
    } catch (error) {
      console.error("Error creating transcription:", error);
      throw error;
    }
  }
}
