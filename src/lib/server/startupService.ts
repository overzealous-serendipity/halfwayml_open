import { transcriptionPollingService } from "@/lib/services/TranscriptionPollingService";

export async function initializeServices() {
  try {
    // Recover polling state on startup
    await transcriptionPollingService.recoverPollingState();
    
    console.log("[StartupService] Services initialized successfully");
  } catch (error) {
    console.error("[StartupService] Error initializing services:", error);
  }
} 