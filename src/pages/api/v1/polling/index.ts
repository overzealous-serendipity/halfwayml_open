import { NextApiRequest, NextApiResponse } from "next";
import { pollingManager } from "@/lib/services/pollingManager";
import { transcriptionPollingService } from "@/lib/services/TranscriptionPollingService";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      // Status check
      return res.status(200).json({
        isPolling: transcriptionPollingService.isPolling,
        activeCount: transcriptionPollingService.getActiveCount()
      });

    case 'POST':
      // Manual start if needed
      await pollingManager.startPollingIfNeeded();
      return res.status(200).json({ message: "Polling service checked/started" });


    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}