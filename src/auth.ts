import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "@/db/queries"
import { signInSchema } from "./lib/zod"
import { ZodError } from "zod"
import bcrypt from "bcrypt"

export const { handlers, auth } = NextAuth({
    providers: [
      Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          try {
            const { email, password } = await signInSchema.parseAsync(credentials)
   
            // Get user first, then verify password
            const dbUser = await getUserFromDb(email)
   
            if (!dbUser || !bcrypt.compareSync(password, dbUser.password)) {
              throw new Error("Invalid credentials.")
            }
   
            return {
              id: String(dbUser.id),
              email: dbUser.email,
            }
          } catch (error) {
            if (error instanceof ZodError) {
              return null
            }
            throw error
          }
        },
      }),
    ],
  })