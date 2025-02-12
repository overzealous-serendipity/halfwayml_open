import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const transcription = await prisma.transcription.findUnique({
        where: { id: String(id) },
        include: {
          workspace: {
            include: {
              users: true,
            },
          },
        },
      });

      if (!transcription) {
        return res.status(404).json({ error: "Transcription not found" });
      }

      // Check if user has access to this workspace
      const hasAccess = transcription.workspace.users.some(
        (user) => user.email === session.user?.email
      );

      if (!hasAccess) {
        return res.status(403).json({ error: "Forbidden" });
      }

      return res.json(transcription);
    } else if (req.method === "PATCH") {
      // Get the transcription first to check permissions
      const transcription = await prisma.transcription.findUnique({
        where: { id: String(id) },
        include: {
          workspace: {
            include: {
              users: true,
            },
          },
        },
      });

      if (!transcription) {
        return res.status(404).json({ error: "Transcription not found" });
      }

      // Check if user has access to this workspace
      const hasAccess = transcription.workspace.users.some(
        (user) => user.email === session.user?.email
      );

      if (!hasAccess) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Update the transcription
      const updatedTranscription = await prisma.transcription.update({
        where: { id: String(id) },
        data: req.body,
      });

      return res.json(updatedTranscription);
    }

    // Handle unsupported methods
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
