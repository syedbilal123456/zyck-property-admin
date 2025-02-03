import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client"; // Ensure correct import path for your Prisma schema
import { NextAuthOptions } from "next-auth";

// Initialize Prisma Client
const db = new PrismaClient();

// Extend NextAuth module to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      user_id: number;
      username: string;
      email: string;
      isAdmin: boolean;
      image: string
    };
  }
  interface User {
    email: string;
    isAdmin: boolean;
    name: string;
    image: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    name: string;
    isAdmin: boolean;
    user_id: number;  // Add user_id to the JWT type
  }
}

// NextAuth options
export const NEXT_AUTH: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email) {
          throw new Error("Missing or invalid credentials");
        }

        const { email } = credentials;
        


        // Fetch the user from the database (ensure they are an admin)
        const existingUser = await db.user.findFirst({
          where: {
            email: email,
            isAdmin: true, // Ensure only admins can sign in
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true,
            avatarUrl: true          
          }
        });

        if (!existingUser) {
          throw new Error("You are not an Admin");
        }

        // Return the user object if valid
        return {
          id: existingUser.id,
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
          image: existingUser.avatarUrl
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = Number(user.id);
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.user_id = token.user_id as number;
        session.user.username = token.name as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.image = token.picture as string
      }
      console.log("Updated Session:", session); // For debugging, you can remove this later
      return session;
    },
  },
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
};
