import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { RotateCcw, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import { Task, TaskFormData, TaskFilters } from '../types';
import { Header } from '../components/Header';
import { TaskBoard } from '../components/TaskBoard';
import { TaskForm } from '../components/TaskForm';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { Skeleton } from '../components/ui/Skeleton';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    category: '',
    priority: '',
    sort: 'asc',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [deletedTask, setDeletedTask] = useState<{ task: Task; timeout: NodeJS.Timeout } | null>(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get<Task[]>('/tasks', {
        params: {
          category: filters.category,
          priority: filters.priority,
          sort: filters.sort,
        },
      });
      setTasks(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters.category, filters.priority, filters.sort]);

  const categories = useMemo(
    () => [...new Set(tasks.map((task) => task.category))],
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [tasks, filters.search]);

  const submitTask = async (form: TaskFormData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
        toast.success('Task updated successfully');
        setEditingTask(null);
      } else {
        await api.post('/tasks', form);
        toast.success('Task created successfully');
      }
      await fetchTasks();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save task');
      throw error;
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}`, { completed: !task.completed });
      toast.success(task.completed ? 'Task marked as pending' : 'Task completed');
      await fetchTasks();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: number) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    if (deletedTask) {
      clearTimeout(deletedTask.timeout);
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const timeout = setTimeout(async () => {
      try {
        await api.delete(`/tasks/${taskId}`);
        setDeletedTask(null);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to delete task');
        setTasks((prev) => [...prev, taskToDelete]);
      }
    }, 5000);

    setDeletedTask({ task: taskToDelete, timeout });

    toast.success('Task deleted', {
      description: 'You can undo this action',
      action: {
        label: 'Undo',
        onClick: () => {
          if (deletedTask) {
            clearTimeout(timeout);
            setTasks((prev) => [...prev, taskToDelete]);
            setDeletedTask(null);
            toast.success('Task restored');
          }
        },
      },
    });
  };

  const handleReorder = useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  }, []);

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="mx-auto max-w-7xl p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid gap-6 lg:grid-cols-[1fr_300px]"
        >
          <div className="space-y-6">
            <TaskForm
              onSubmit={submitTask}
              editingTask={editingTask}
              onCancel={() => setEditingTask(null)}
            />

            <div>
              <SearchBar
                value={filters.search}
                onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Press <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700">Ctrl+K</kbd> to focus search
              </p>
            </div>
          </div>

          <FilterPanel
            categories={categories}
            filters={filters}
            onChange={setFilters}
          />
        </motion.div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            onToggleComplete={toggleComplete}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onReorder={handleReorder}
          />
        )}
      </main>
    </div>
  );
};
