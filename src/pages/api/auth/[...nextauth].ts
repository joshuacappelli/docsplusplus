import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Your NextAuth configuration
export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub OAuth Provider
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Credentials (Email/Password) Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        // Replace with actual DB logic (this is an example)
        const user = await getUserByEmail(email); // Fetch from DB
        if (!user) {
          throw new Error("No user found");
        }

        // Check password (hashed with bcrypt)
        const isValid = bcrypt.compareSync(password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // If valid, return the user object
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  // JWT strategy for session handling
  session: {
    strategy: "jwt",
  },

  // Callbacks for customizing behavior
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  // Pages configuration (custom sign-in page)
  pages: {
    signIn: "/auth/login", // Redirect users to a custom login page if needed
  },
};

export default NextAuth(authOptions);

// Example DB function for CredentialsProvider
async function getUserByEmail(email: string) {
  // Replace with actual database call
  const mockUserDB = [
    { id: 1, email: "test@example.com", passwordHash: bcrypt.hashSync("password123", 10), name: "Test User" },
  ];
  return mockUserDB.find((user) => user.email === email) || null;
}
