import { transcriptionPollingService } from "@/lib/services/TranscriptionPollingService";
import { prisma } from "@/lib/prisma";

class PollingManager {
  private static instance: PollingManager;
  private healthCheckInterval?: NodeJS.Timeout;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

  private constructor() {}

  public static getInstance(): PollingManager {
    if (!PollingManager.instance) {
      PollingManager.instance = new PollingManager();
    }
    return PollingManager.instance;
  }

  public async startPollingIfNeeded(): Promise<void> {
    const processingCount = await prisma.transcription.count({
      where: { status: "processing" }
    });

    if (processingCount > 0 && !transcriptionPollingService.isPolling) {
      transcriptionPollingService.startPolling();
      this.startHealthCheck();
    }
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) return;

    this.healthCheckInterval = setInterval(async () => {
      const processingCount = await prisma.transcription.count({
        where: { status: "processing" }
      });

      if (processingCount === 0 && transcriptionPollingService.isPolling) {
        transcriptionPollingService.stopPolling();
        this.stopHealthCheck();
      }
    }, this.HEALTH_CHECK_INTERVAL);
  }

  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }
}

export const pollingManager = PollingManager.getInstance();