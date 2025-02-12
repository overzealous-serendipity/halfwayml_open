import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SessionUser } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      workspaceId?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    workspaceId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            workspaces: {
              select: {
                id: true,
              },
            },
            role: true,
          },
        });
        console.log("User from the auth options: ", user);
        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Log the workspace ID to verify it exists
        console.log("Workspace ID:", user.workspaces[0]?.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          workspaceId: user.workspaces[0]?.id, // This should be flat
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // If this is the initial sign in
      if (user) {
        token.id = user.id;
        token.workspaceId = (user as SessionUser).workspaceId;
      }

      // If this is a token refresh or validation
      if (trigger === "update" || (!user && !token.workspaceId)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { 
              id: token.id as string  // Add type assertion here
            },
            select: {
              id: true,
              workspaces: {
                select: {
                  id: true,
                },
              },
            },
          });
          
          token.workspaceId = dbUser?.workspaces[0]?.id;
        } catch (error) {
          console.error("Error fetching workspace:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id  = token.id as string;
        session.user.workspaceId = token.workspaceId as string;
      }
      return session;

    },
  },
};

export default NextAuth(authOptions);
