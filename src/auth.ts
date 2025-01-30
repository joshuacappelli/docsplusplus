import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "@/db/queries";
import { signInSchema } from "./lib/zod";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";

// Configure your NextAuth options
export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate form inputs with Zod
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Look up the user in your database
          const dbUser = await getUserFromDb(email);
          if (!dbUser) {
            throw new Error("Invalid credentials.");
          }

          // Compare the hashed password in DB with what the user provided
          const validPassword = bcrypt.compareSync(password, dbUser.password);
          if (!validPassword) {
            throw new Error("Invalid credentials.");
          }

          return {
            id: String(dbUser.id),
            email: dbUser.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation failed:", error);
            return null; // null signals "Invalid credentials" to NextAuth
          }
          throw error;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

// NextAuth for App Router
export const { handlers, auth } = NextAuth(authOptions);
