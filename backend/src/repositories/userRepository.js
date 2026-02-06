import { getDb } from '../config/sqlDb.js';

export const findUserByEmail = async (email) => {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE email = ?', email);
};

export const createUser = async ({ name, email, password }) => {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    name,
    email,
    password
  );

  return { id: result.lastID, name, email };
};

