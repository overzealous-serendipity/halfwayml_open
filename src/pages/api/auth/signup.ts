import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, name } = req.body;
    console.log("req.body", req.body);
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    console.log("User created:", user);

    // Create workspace with proper JSON metadata
    const workspaceData = {
      name: "My Workspace",
      description: "",
      createdById: user.id,
      organizationId: uuidv4(),
      metaData: {
        createdAt: new Date().toISOString(), // Convert Date to ISO string
        updatedAt: new Date().toISOString(), // Convert Date to ISO string

        glossary: {
          words: [],
        },
        subtitlePreferences: {
          subtitleStyle: 2,
          parameters: {
            cpl: 42,
            gap: 25,
            cps: 20,
            minDuration: 0.1,
            maxDuration: 10,  
          },
        },
      },
    };

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        ...workspaceData,
        users: {

          connect: { id: user.id }, // Connect user using Prisma relations
        },
      },
    });
    console.log("Workspace created:", workspace);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
