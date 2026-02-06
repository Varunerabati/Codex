import { motion } from 'framer-motion';
import { Calendar, Flag, FolderOpen, MoreVertical, Trash2, Edit3, Check, X } from 'lucide-react';
import { Task } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const priorityConfig = {
  high: { color: 'danger', icon: '🔴' },
  medium: { color: 'warning' as const, icon: '🟡' },
  low: { color: 'info' as const, icon: '🟢' },
};

const statusConfig = {
  Pending: { color: 'warning' as const, icon: '⏳' },
  Completed: { color: 'success' as const, icon: '✅' },
  Overdue: { color: 'danger' as const, icon: '⚠️' },
};

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="p-4 hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
              <Badge variant={statusConfig[task.status].color}>
                {statusConfig[task.status].icon} {task.status}
              </Badge>
            </div>
            {task.description && (
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
            )}
          </div>
          <div className="relative">
            <button
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              onClick={() => setShowMenu(!showMenu)}
              {...attributes}
              {...listeners}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>{task.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5" />
            <span>{priorityConfig[task.priority].icon} {task.priority}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(task.dueDate || task.due_date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={task.completed ? 'outline' : 'primary'}
            onClick={() => onToggleComplete(task)}
            className="flex-1"
          >
            {task.completed ? (
              <>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Mark Pending
              </>
            ) : (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Complete
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
