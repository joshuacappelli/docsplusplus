import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
});

export const docsTable = sqliteTable('docs', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

export const textBlocksTable = sqliteTable('text_blocks', {
  id: integer('id').primaryKey(),
  text: text('text').notNull(),
  type: text('type').notNull(),
  docId: integer('doc_id')
    .notNull()
    .references(() => docsTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertDoc = typeof docsTable.$inferInsert;
export type SelectDoc = typeof docsTable.$inferSelect;

export type InsertTextBlock = typeof textBlocksTable.$inferInsert;
export type SelectTextBlock = typeof textBlocksTable.$inferSelect;