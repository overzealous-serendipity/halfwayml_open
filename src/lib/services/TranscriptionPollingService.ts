import { prisma } from "@/lib/prisma";
import { AssemblyAI } from "assemblyai";
import { TranscriptionService } from "@/config/util/services/transcriptionService";

if (typeof window !== "undefined") {
  throw new Error(
    "TranscriptionPollingService can only be used on the server side"
  );
}

interface TranscriptionStatus {
  id: string;
  status: string;
  text?: string;
  words?: any[];
  paragraphs?: any[];
  speakers?: any[];
  utterances?: any[];
}

export class TranscriptionPollingService {
  private static instance: TranscriptionPollingService;
  public isPolling: boolean = false;
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL = 10000; // 10 seconds
  private readonly MAX_RETRIES = 180; // 30 minutes maximum
  private retryCount: Map<string, number> = new Map();
  private activeTranscriptions: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): TranscriptionPollingService {
    if (!TranscriptionPollingService.instance) {
      TranscriptionPollingService.instance = new TranscriptionPollingService();
    }
    return TranscriptionPollingService.instance;
  }

  public getActiveCount(): number {
    return this.activeTranscriptions.size;
  }

  public startPolling(): void {
    console.log("[TranscriptionPoller] Starting polling service");
    if (this.isPolling) {
      console.log("[TranscriptionPoller] Already polling");
      return;
    }

    // Immediately check for pending transcriptions
    this.pollPendingTranscriptions().catch(console.error);

    this.isPolling = true;
    this.pollingInterval = setInterval(async () => {
      await this.pollPendingTranscriptions().catch(console.error);
    }, this.POLLING_INTERVAL);

    console.log("[TranscriptionPoller] Polling service started");
  }

  public stopPolling(): void {
    if (this.pollingInterval) {
      console.log("Stopping transcription polling");
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  private async pollPendingTranscriptions(): Promise<void> {
    console.log("\n[TranscriptionPoller] Starting polling cycle");
    try {
      // Check for processing transcriptions
      const count = await prisma.transcription.count({
        where: {
          status: "processing",
        },
      });

      console.log(`[TranscriptionPoller] Found ${count} processing transcriptions`);

      // Stop polling if no transcriptions are processing
      if (count === 0) {
        console.log("[TranscriptionPoller] No active transcriptions, stopping polling");
        this.stopPolling();
        return;
      }

      const processingTranscriptions = await prisma.transcription.findMany({
        where: {
          status: "processing",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        include: {
          editor: {
            include: {
              credentials: {
                where: { name: "AssemblyAI" },
              },
            },
          },
        },
      });

      this.activeTranscriptions = new Set(
        processingTranscriptions.map((t) => t.id)
      );

      await Promise.allSettled(
        processingTranscriptions.map(async (transcription) => {
          // Check retry count
          const retries = this.retryCount.get(transcription.id) || 0;
          if (retries >= this.MAX_RETRIES) {
            console.log(
              `Max retries reached for transcription ${transcription.id}`
            );
            await this.updateTranscriptionStatus(transcription.id, {
              id: transcription.serviceId!,
              status: "error",
            });
            this.retryCount.delete(transcription.id);
            return;
          }

          console.log(
            `Processing transcription ${transcription.id} with AssemblyAI ID ${
              transcription.serviceId
            } (attempt ${retries + 1})`
          );

          const apiKey = transcription.editor.credentials[0]?.secret;
          if (!apiKey || !transcription.serviceId) return;

          try {
            const status = await this.checkTranscriptionStatus(
              transcription.serviceId,
              apiKey
            );
            console.log(`Status for ${transcription.id}:`, status);

            if (status.status === "completed" || status.status === "error") {
              this.retryCount.delete(transcription.id);
            } else {
              this.retryCount.set(transcription.id, retries + 1);
            }

            await this.updateTranscriptionStatus(transcription.id, status as TranscriptionStatus);
          } catch (error) {
            console.error(
              `Error polling transcription ${transcription.id}:`,
              error
            );
            this.retryCount.set(transcription.id, retries + 1);
          }
        })
      );
    } catch (error) {
      console.error("[TranscriptionPoller] Error in polling loop:", error);
    }
  }

  private async checkTranscriptionStatus(
    assemblyAIId: string,
    apiKey: string
  ) {
    const client = new AssemblyAI({ apiKey });

    const transcript = await client.transcripts.get(assemblyAIId);
    return transcript;
  }

  private async updateTranscriptionStatus(
    transcriptionId: string,
    status: TranscriptionStatus
  ): Promise<void> {
    console.log("Updating transcription status");

    try {
      const transcription = await prisma.transcription.findUnique({
        where: { id: transcriptionId },
        include: {
          editor: {
            include: {
              credentials: {
                where: { name: "AssemblyAI" },
              },
            },
          },
        },
      });

      if (!transcription || !transcription.editor.credentials[0]?.secret) {
        throw new Error("Transcription or credentials not found");
      }

      const transcriptionService = new TranscriptionService(
        transcription.editor.credentials[0].secret,
        transcriptionId
      );

      await transcriptionService.processTranscription(status);
    } catch (error) {
      console.error("Error updating transcription:", error);
      throw error;
    }
  }

  // Add method to check if there are any pending transcriptions
  public async hasPendingTranscriptions(): Promise<boolean> {
    const count = await prisma.transcription.count({
      where: {
        status: "processing",
      },
    });
    return count > 0;
  }

  // Add auto-recovery method
  public async recoverPollingState(): Promise<void> {
    const hasPending = await this.hasPendingTranscriptions();
    if (hasPending && !this.isPolling) {
      console.log("[TranscriptionPoller] Recovering polling state for pending transcriptions");
      this.startPolling();
    }
  }
}

// Export a singleton instance
export const transcriptionPollingService =
  TranscriptionPollingService.getInstance();
