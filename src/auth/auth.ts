import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client"; // Import User type from Prisma schema
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
        };
    }
    interface User {
        email: string;
        isAdmin: boolean;
        name: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        email: string;
        name: string;
        isAdmin: boolean;}
}

export const NEXT_AUTH: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
            },
            async authorize(credentials) {
                // Ensure credentials are defined
                if (!credentials || !credentials.email) {
                    throw new Error("Missing or invalid credentials");
                }

                const { email } = credentials;
                console.log(email);
                
                // Fetch the user from the database
                const existingUser = await db.user.findFirst({
                    where: {
                        email: email,
                        isAdmin: true, // Ensure only admins can sign in
                    },
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
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as unknown as number;
                token.name = user.name as string;
                token.email = user.email;
                token.isAdmin = user.isAdmin as unknown as boolean;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.user_id = token.id as number;
                session.user.username = token.name;
                session.user.email = token.email;
                session.user.isAdmin = token.isAdmin;
            }
            console.log("Updated Session:", session);
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
};
