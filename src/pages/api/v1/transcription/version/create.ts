import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { transcriptionId, workspaceId, url } = req.body;

    // Get the current version count for this transcription
    const versionCount = await prisma.version.count({
      where: { transcriptionId },
    });

    // Create new version
    const version = await prisma.version.create({
      data: {
        versionNumber: versionCount + 1,
        content: {}, // You'll need to determine what content to store
        url: url,
        transcriptionId: transcriptionId,
        createdById: session.user.id,
      },
    });

    // Update the transcription's lastVersionURL
    await prisma.transcription.update({
      where: { id: transcriptionId },
      data: {
        lastVersionURL: url,
      },
    });

    // Create event log
    await prisma.eventLog.create({
      data: {
        entityId: transcriptionId,
        entityType: "transcription",
        eventType: "update",
        eventDetails: "New version of transcription added",
      },
    });

    return res.status(200).json(version);
  } catch (error) {
    const e = error as Error;
    return res.status(500).json({
      error: e.message || "Internal Server Error",
    });
  }
}
