import { sql } from 'drizzle-orm';
import { db } from './index';
import { usersTable } from './schema';
import { eq } from 'drizzle-orm';

async function getUserFromDb(email: string) {
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
  return user[0];
}

export { getUserFromDb };
