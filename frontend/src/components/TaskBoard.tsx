import { DndContext, DragEndEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

interface TaskBoardProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onReorder: (tasks: Task[]) => void;
}

const columns = ['Pending', 'Completed', 'Overdue'] as const;

const columnConfig = {
  Pending: { color: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', icon: '⏳' },
  Completed: { color: 'border-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', icon: '✅' },
  Overdue: { color: 'border-red-400', bg: 'bg-red-50 dark:bg-red-950/20', icon: '⚠️' },
};

export const TaskBoard = ({ tasks, onToggleComplete, onEdit, onDelete, onReorder }: TaskBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);
      onReorder(newTasks);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 lg:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column);

          return (
            <motion.div
              key={column}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`border-t-4 ${columnConfig[column].color} ${columnConfig[column].bg} p-4`}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {columnConfig[column].icon} {column}
                  </h2>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {columnTasks.length}
                  </span>
                </div>

                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <Card className="p-6 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No {column.toLowerCase()} tasks
                        </p>
                      </Card>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </DndContext>
  );
};
