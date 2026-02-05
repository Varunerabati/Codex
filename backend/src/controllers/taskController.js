import { Task } from '../models/Task.js';

const withOverdueLabel = (task) => {
  const plain = task.toObject();
  const isOverdue = !plain.completed && new Date(plain.dueDate) < new Date();

  return {
    ...plain,
    status: plain.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending',
  };
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.userId });
    res.status(201).json(withOverdueLabel(task));
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { category, priority, sort = 'asc' } = req.query;
    const query = { user: req.userId };

    if (category) query.category = category;
    if (priority) query.priority = priority;

    const sortOrder = sort === 'desc' ? -1 : 1;

    const tasks = await Task.find(query).sort({ dueDate: sortOrder, createdAt: -1 });
    res.json(tasks.map(withOverdueLabel));
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(withOverdueLabel(task));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
