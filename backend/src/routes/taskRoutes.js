import express from 'express';
import { body, param } from 'express-validator';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
];

router.use(protect);
router.get('/', getTasks);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', [param('id').isInt().withMessage('Invalid task id'), ...taskValidation], validate, updateTask);
router.patch(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid task id'),
    body('completed').isBoolean().withMessage('Completed must be true or false'),
  ],
  validate,
  updateTask
);
router.delete('/:id', [param('id').isInt().withMessage('Invalid task id')], validate, deleteTask);

export default router;
