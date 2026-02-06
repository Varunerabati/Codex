import {
  createTaskForUser,
  deleteTaskForUser,
  getTasksForUser,
  updateTaskForUser,
  findTaskForUserById,
} from '../repositories/taskRepository.js';

const withOverdueLabel = (task) => {
  const isOverdue = !task.completed && new Date(task.due_date) < new Date();

  return {
    ...task,
    status: task.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending',
  };
};

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskForUser(req.userId, req.body);
    res.status(201).json(withOverdueLabel(task));
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { category, priority, sort = 'asc' } = req.query;
    const tasks = await getTasksForUser(req.userId, { category, priority, sort });

    res.json(tasks.map(withOverdueLabel));
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await findTaskForUserById(req.userId, id);
    if (!existing) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const task = await updateTaskForUser(req.userId, id, req.body);
    res.json(withOverdueLabel(task));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTaskForUser(req.userId, id);

    if (!deleted) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    await db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', id, req.userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
