import { sql } from 'drizzle-orm';
import { db } from './index';
import { usersTable } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function getUserFromDb(email: string) {
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
  return user[0];
}

async function createUserInDb(email: string, password: string) {
  const newUser = await db.insert(usersTable).values({
    email,
    password: bcrypt.hashSync(password, 10),
  });
  return newUser;
}

export { getUserFromDb, createUserInDb };
