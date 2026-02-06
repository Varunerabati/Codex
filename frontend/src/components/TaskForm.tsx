import { useEffect, useState, FormEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Task, TaskFormData } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskFormProps {
  onSubmit: (form: TaskFormData) => Promise<void>;
  editingTask: Task | null;
  onCancel: () => void;
}

const initialState: TaskFormData = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  dueDate: '',
};

export const TaskForm = ({ onSubmit, editingTask, onCancel }: TaskFormProps) => {
  const [form, setForm] = useState<TaskFormData>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category,
        priority: editingTask.priority,
        dueDate: (editingTask.dueDate || editingTask.due_date).slice(0, 10),
      });
    } else {
      setForm(initialState);
    }
  }, [editingTask]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm(initialState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        {editingTask && (
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Enter task title..."
          required
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />

        <Textarea
          label="Description"
          placeholder="Add task description..."
          rows={3}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />

        <Input
          label="Category"
          placeholder="e.g., Work, Personal, Study..."
          required
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </Select>

          <Input
            label="Due Date"
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1" loading={loading}>
            {editingTask ? (
              'Update Task'
            ) : (
              <>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Task
              </>
            )}
          </Button>
          {editingTask && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
