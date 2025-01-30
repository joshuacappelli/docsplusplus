import Credentials from "next-auth/providers/credentials";
import NextAuth, { type NextAuthConfig } from "next-auth"; // <-- Use NextAuthConfig
import { getUserFromDb } from "@/db/queries";
import { signInSchema } from "@/lib/zod";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate form inputs with Zod
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Look up the user in the database
          const dbUser = await getUserFromDb(email);
          if (!dbUser) {
            console.warn(`Login failed: No user found with email ${email}`);
            return null;
          }

          // Compare hashed password in DB with the provided password
          const validPassword = await bcrypt.compare(password, dbUser.password);
          if (!validPassword) {
            console.warn(`Login failed: Incorrect password for ${email}`);
            return null;
          }

          console.log(`User ${email} authenticated successfully.`);
          return {
            id: String(dbUser.id),
            email: dbUser.email,
            emailVerified: null,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation failed:", error);
            return null;
          }
          console.error("Authentication error:", error);
          throw new Error("Internal server error");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt", 
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
      };
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET, // ✅ Secret moved to the root level
};

// Export NextAuth for API Routes (App Router)
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
