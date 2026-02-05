import { useEffect, useState } from 'react';

const initialState = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  dueDate: '',
};

export const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate.slice(0, 10),
      });
    } else {
      setForm(initialState);
    }
  }, [editingTask]);

  return (
    <form
      className="grid gap-3 rounded-lg bg-white p-4 shadow"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
        setForm(initialState);
      }}
    >
      <h2 className="text-lg font-semibold">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
      <input className="rounded border p-2" placeholder="Title" required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
      <textarea className="rounded border p-2" placeholder="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
      <input className="rounded border p-2" placeholder="Category" required value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <select className="rounded border p-2" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input className="rounded border p-2" type="date" required value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
          {editingTask ? 'Update' : 'Add'}
        </button>
        {editingTask && (
          <button className="rounded border px-4 py-2" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
