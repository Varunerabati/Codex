import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbPromise;

export const connectSQL = async () => {
  if (!dbPromise) {
    dbPromise = open({
      filename: './data.sqlite',
      driver: sqlite3.Database,
    });
  }

  const db = await dbPromise;

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables if they do not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT NOT NULL,
      priority TEXT NOT NULL,
      due_date DATETIME NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('SQLite database ready');
  return db;
};

export const getDb = async () => {
  // Always return an actual db instance, not a Promise-of-a-Promise
  const db = await connectSQL();
  return db;
};

