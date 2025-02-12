import type { NextApiRequest, NextApiResponse } from "next";
import { createTranscription } from "@/config/util/workflows/serverSide/createTranscription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { fileKey, languageCode, fileName, fileDuration } = req.body;

    if (!fileKey || !languageCode || !fileName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { workspaces: true },
    });

    if (!user?.workspaces?.[0]?.id) {
      return res.status(400).json({ error: "No workspace found for user" });
    }

    const response = await createTranscription({
      userId: session.user.id,
      fileKey,
      workspaceId: user.workspaces[0].id,
      languageCode,
      fileName,
      fileDuration,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in transcription creation:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
