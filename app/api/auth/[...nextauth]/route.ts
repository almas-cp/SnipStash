import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userDb } from "@/lib/db";
import { AUTH_CONFIG } from "@/lib/auth-config";

// Make sure NEXTAUTH_URL is set in production
if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
  console.warn(
    "Warning: NEXTAUTH_URL is not set in production environment. " +
    "This can cause issues with callbacks and redirects. " +
    "Please set it to your canonical URL."
  );
}

// This is required for NextAuth to work properly in certain deployment environments
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth({
  ...AUTH_CONFIG,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Invalid credentials - missing email or password");
          throw new Error("Invalid credentials");
        }

        try {
          const user = await userDb.findUnique({
            email: credentials.email,
          });

          if (!user || !user?.password) {
            console.log("[AUTH] User not found or missing password");
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            console.log("[AUTH] Password mismatch");
            throw new Error("Invalid credentials");
          }

          console.log("[AUTH] User authenticated successfully:", user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("[AUTH] Error in authorize function:", error);
          throw new Error("Authentication error");
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST }; 