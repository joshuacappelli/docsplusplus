import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "@/db/queries";
import { signInSchema } from "./lib/zod";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";

// Define authOptions
export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Get user from the databsase
          const dbUser = await getUserFromDb(email);

          if (!dbUser || !bcrypt.compareSync(password, dbUser.password)) {
            throw new Error("Invalid credentials.");
          }

          return {
            id: String(dbUser.id),
            email: dbUser.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation failed:", error);
            return null; // Return null to indicate invalid credentials
          }
          throw error;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

// Export the NextAuth handlers using authOptions
export const { handlers, auth } = NextAuth(authOptions);
