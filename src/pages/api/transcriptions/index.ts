import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { workspaceId, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const [transcriptions, total] = await Promise.all([
      prisma.transcription.findMany({
        where: {
          workspaceId: String(workspaceId),
          isDeleted: false,
          workspace: {
            users: {
              some: {
                id: session.user.id,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: Number(limit),
      }),
      prisma.transcription.count({
        where: {
          workspaceId: String(workspaceId),
          isDeleted: false,
          workspace: {
            users: {
              some: {
                id: session.user.id,
              },
            },
          },
        },
      }),
    ]);

    return res.json({
      transcriptions,
      total,
    });
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return res.status(500).json({ error: "Failed to fetch transcriptions" });
  }
}
