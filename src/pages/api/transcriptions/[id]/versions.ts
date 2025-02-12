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
    // Check user access to transcription
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

    const hasAccess = transcription.workspace.users.some(
      (user) => user.email === session.user?.email
    );

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        const versions = await prisma.version.findMany({
          where: { transcriptionId: String(id) },
          include: {
            createdBy: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            versionNumber: "desc",
          },
        });
        return res.json(versions);

      case "POST":
        if (!session.user.email) {
          return res.status(401).json({ error: "Unauthorized - No email"  });
        }
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });


        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Get latest version number
        const latestVersion = await prisma.version.findFirst({
          where: { transcriptionId: String(id) },
          orderBy: { versionNumber: "desc" },
        });

        const newVersion = await prisma.version.create({
          data: {
            versionNumber: (latestVersion?.versionNumber || 0) + 1,
            content: req.body.content,
            url: req.body.url,
            transcriptionId: String(id),
            createdById: user.id,
          },
          include: {
            createdBy: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
        return res.status(201).json(newVersion);

      case "DELETE":
        const { versionId } = req.body;
        if (!versionId) {
          return res.status(400).json({ error: "Version ID is required" });
        }

        const deletedVersion = await prisma.version.delete({
          where: { id: versionId },
        });
        return res.json(deletedVersion);

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling versions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
