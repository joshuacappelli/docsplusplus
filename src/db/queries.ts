import { and, exists, sql } from 'drizzle-orm';
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

async function getDocumentFromDb(userId: number, documentId: number) {
  const document = await db.select().from(docsTable).where(and(eq(docsTable.id, documentId), eq(docsTable.userId, userId)));
  return document[0];
}

async function createDocumentInDb(userId: number, title: string) {
  const newDocument = await db.insert(docsTable).values({
    userId,
    title,
  });
  return newDocument;
}

async function updateDocumentinDb(userId: number, documentId: number, title: string) {
  const updatedDocument = await db.update(docsTable).set({
    title: title,
  }).where(and(eq(docsTable.id, documentId), eq(docsTable.userId, userId)));
  return updatedDocument;
}   

async function deleteDocumentInDb(userId: number, documentId: number) {
  const deletedDocument = await db.delete(docsTable).where(and(eq(docsTable.id, documentId), eq(docsTable.userId, userId)));
  return deletedDocument;
}

async function getTextBlocksFromDb(documentId: number, userId: number) {
  const textBlocks = await db
    .select()
    .from(textBlocksTable)
    .innerJoin(docsTable, eq(textBlocksTable.docId, docsTable.id))
    .where(
      and(
        eq(textBlocksTable.docId, documentId),
        eq(docsTable.userId, userId)
      )
    );
  return textBlocks;
}

async function createTextBlockInDb(documentId: number, userId: number, text: string, type: string) {
  // First verify the document belongs to the user
  const document = await getDocumentFromDb(userId, documentId);
  console.log(document);
  if (!document) {
    throw new Error('Document not found or access denied');
  }

  const newTextBlock = await db.insert(textBlocksTable).values({
    docId: documentId,
    text: text,
    type: type,
    createdAt: sql`CURRENT_TIMESTAMP`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  });
  return newTextBlock;
}

async function updateTextBlockInDb(textBlockId: number, documentId: number, userId: number, text: string) {
  const updatedTextBlock = await db
    .update(textBlocksTable)
    .set({
      text: text,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(
      and(
        eq(textBlocksTable.id, textBlockId),
        eq(textBlocksTable.docId, documentId),
        exists(
          db
            .select()
            .from(docsTable)
            .where(and(eq(docsTable.id, documentId), eq(docsTable.userId, userId)))
        )
      )
    );
  return updatedTextBlock;
}

async function deleteTextBlockInDb(textBlockId: number, documentId: number, userId: number) {
  const deletedTextBlock = await db
    .delete(textBlocksTable)
    .where(
      and(
        eq(textBlocksTable.id, textBlockId),
        eq(textBlocksTable.docId, documentId),
        exists(
          db
            .select()
            .from(docsTable)
            .where(and(eq(docsTable.id, documentId), eq(docsTable.userId, userId)))
        )
      )
    );
  return deletedTextBlock;
}


export { getUserFromDb, createUserInDb, getDocumentsFromDb, getDocumentFromDb, getTextBlocksFromDb, createDocumentInDb, createTextBlockInDb, updateTextBlockInDb, deleteTextBlockInDb , deleteDocumentInDb, updateDocumentinDb};
