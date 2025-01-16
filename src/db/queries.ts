import { sql } from 'drizzle-orm';
import { db } from './index';
import { usersTable , docsTable, textBlocksTable } from './schema';
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

async function getDocumentsFromDb(userId: number) {
  const documents = await db.select().from(docsTable).where(eq(docsTable.userId, userId));
  return documents;
}

async function getDocumentFromDb(documentId: number) {
  const document = await db.select().from(docsTable).where(eq(docsTable.id, documentId));
  return document[0];
}

async function createDocumentInDb(userId: number, title: string) {
  const newDocument = await db.insert(docsTable).values({
    userId,
    title,
  });
  return newDocument;
}

async function deleteDocumentInDb(documentId: number) {
  const deletedDocument = await db.delete(docsTable).where(eq(docsTable.id, documentId));
  return deletedDocument;
}

async function getTextBlocksFromDb(documentId: number) {
  const textBlocks = await db.select().from(textBlocksTable).where(eq(textBlocksTable.docId, documentId));
  return textBlocks;
}   

async function createTextBlockInDb(documentId: number, text: string) {
  const newTextBlock = await db.insert(textBlocksTable).values({
    docId: documentId,
    text: text,
    type: 'text',
    createdAt: sql`CURRENT_TIMESTAMP`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  });
  return newTextBlock;
}

async function updateTextBlockInDb(textBlockId: number, text: string) {
  const updatedTextBlock = await db.update(textBlocksTable).set({
    text: text,
  }).where(eq(textBlocksTable.id, textBlockId));
  return updatedTextBlock;
}

async function deleteTextBlockInDb(textBlockId: number) {
  const deletedTextBlock = await db.delete(textBlocksTable).where(eq(textBlocksTable.id, textBlockId));
  return deletedTextBlock;
}


export { getUserFromDb, createUserInDb, getDocumentsFromDb, getDocumentFromDb, getTextBlocksFromDb, createDocumentInDb, createTextBlockInDb, updateTextBlockInDb, deleteTextBlockInDb };
