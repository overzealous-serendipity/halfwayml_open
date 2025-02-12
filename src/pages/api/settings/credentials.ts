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

  if (req.method === "GET") {
    const credentials = await prisma.credential.findMany({
      where: { userId: session.user.id },
    });
    return res.status(200).json(credentials);
  }

  if (req.method === "POST") {
    const { name, key, secret } = req.body;

    try {
      // Try to find existing credential with same name for this user
      const existingCredential = await prisma.credential.findFirst({
        where: {
          userId: session.user.id,
          name: name,
        },
      });

      if (existingCredential) {
        // Update existing credential
        const updatedCredential = await prisma.credential.update({
          where: {
            id: existingCredential.id,
          },
          data: {
            key,
            secret,
            updatedAt: new Date(),
          },
        });
        return res.status(200).json(updatedCredential);
      }

      // Create new credential if none exists with this name
      const credential = await prisma.credential.create({
        data: {
          name,
          key,
          secret,
          userId: session.user.id,
        },
      });
      return res.status(201).json(credential);
    } catch (error) {
      const e = error as Error;
      if (e.message === "P2002") {
        return res.status(400).json({
          error: "A credential with this name already exists",
        });
      }
      return res.status(500).json({
        error: "Error creating/updating credential",
      });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await prisma.credential.delete({
      where: { id: String(id) },
    });
    return res.status(200).json({ message: "Credential deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
