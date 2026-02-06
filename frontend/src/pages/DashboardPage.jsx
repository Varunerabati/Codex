import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { TaskBoard } from '../components/TaskBoard';
import { TaskForm } from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ category: '', priority: '', sort: 'asc' });

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks', { params: filters });
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [filters.category, filters.priority, filters.sort]);

  const categories = useMemo(
    () => [...new Set(tasks.map((task) => task.category))],
    [tasks]
  );

  const submitTask = async (form) => {
    if (editingTask) {
      await api.put(`/tasks/${editingTask.id}`, form);
      setEditingTask(null);
    } else {
      await api.post('/tasks', form);
    }
    await fetchTasks();
  };

  const toggleComplete = async (task) => {
    await api.patch(`/tasks/${task.id}`, { completed: !task.completed });
    await fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    await fetchTasks();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Task Dashboard</h1>
          <p className="text-slate-600">Welcome, {user?.name}</p>
        </div>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <TaskForm onSubmit={submitTask} editingTask={editingTask} onCancel={() => setEditingTask(null)} />

        <div className="h-fit rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Filters</h2>
          <div className="space-y-3">
            <select
              className="w-full rounded border p-2"
              value={filters.category}
              onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded border p-2"
              value={filters.priority}
              onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              className="w-full rounded border p-2"
              value={filters.sort}
              onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
            >
              <option value="asc">Due Date (Earliest)</option>
              <option value="desc">Due Date (Latest)</option>
            </select>
          </div>
        </div>
      </div>

      <TaskBoard tasks={tasks} onToggleComplete={toggleComplete} onEdit={setEditingTask} onDelete={deleteTask} />
    </div>
  );
};
