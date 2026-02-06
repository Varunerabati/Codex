import { getDb } from '../config/sqlDb.js';

export const createTaskForUser = async (userId, { title, description = '', category, priority, dueDate }) => {
  const db = await getDb();

  const result = await db.run(
    `INSERT INTO tasks (user_id, title, description, category, priority, due_date, completed)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    userId,
    title,
    description,
    category,
    priority,
    dueDate
  );

  return db.get('SELECT * FROM tasks WHERE id = ?', result.lastID);
};

export const getTasksForUser = async (userId, { category, priority, sort = 'asc' }) => {
  const db = await getDb();
  const params = [userId];
  const where = ['user_id = ?'];

  if (category) {
    where.push('category = ?');
    params.push(category);
  }

  if (priority) {
    where.push('priority = ?');
    params.push(priority);
  }

  const sortOrder = sort === 'desc' ? 'DESC' : 'ASC';

  return db.all(
    `SELECT * FROM tasks
     WHERE ${where.join(' AND ')}
     ORDER BY due_date ${sortOrder}, created_at DESC`,
    ...params
  );
};

export const findTaskForUserById = async (userId, id) => {
  const db = await getDb();
  return db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', id, userId);
};

export const updateTaskForUser = async (userId, id, updates) => {
  const db = await getDb();
  const existing = await findTaskForUserById(userId, id);

  if (!existing) return null;

  const merged = {
    title: updates.title ?? existing.title,
    description: updates.description ?? existing.description,
    category: updates.category ?? existing.category,
    priority: updates.priority ?? existing.priority,
    due_date: updates.dueDate ?? existing.due_date,
    completed:
      typeof updates.completed === 'boolean'
        ? updates.completed
        : existing.completed,
  };

  await db.run(
    `UPDATE tasks
     SET title = ?, description = ?, category = ?, priority = ?, due_date = ?, completed = ?
     WHERE id = ? AND user_id = ?`,
    merged.title,
    merged.description,
    merged.category,
    merged.priority,
    merged.due_date,
    merged.completed ? 1 : 0,
    id,
    userId
  );

  return findTaskForUserById(userId, id);
};

export const deleteTaskForUser = async (userId, id) => {
  const db = await getDb();
  const existing = await findTaskForUserById(userId, id);
  if (!existing) return false;

  await db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', id, userId);
  return true;
};

