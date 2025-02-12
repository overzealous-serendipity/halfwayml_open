import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { uuid } = req.body;
    if (!uuid) {
      return res.status(400).json({ error: "Transcription UUID is required" });
    }

    // Find the transcription and verify workspace access
    const transcription = await prisma.transcription.findUnique({
      where: { uuid },
      include: {
        workspace: true
      }
    });

    if (!transcription) {
      return res.status(404).json({ error: "Transcription not found" });
    }

    // Check if user has access to the workspace
    const hasAccess = await prisma.workspace.findFirst({
      where: {
        id: transcription.workspaceId,
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    });

    if (!hasAccess) {
      return res.status(403).json({ error: "Not authorized to delete this transcription" });
    }

    // Soft delete the transcription
    await prisma.transcription.update({
      where: { uuid },
      data: { isDeleted: true }
    });

    // Log the deletion
    await prisma.eventLog.create({
      data: {
        entityId: transcription.id,
        entityType: "transcription",
        eventType: "delete",
        eventDetails: `Transcription "${transcription.title}" deleted by ${session.user.email}`,
      },
    });

    return res.status(200).json({ message: "Transcription deleted successfully" });
  } catch (error) {
    console.error("Error deleting transcription:", error);
    return res.status(500).json({ error: "Failed to delete transcription" });
  }
}
