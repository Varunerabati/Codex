const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Overdue: 'bg-rose-100 text-rose-800',
};

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-semibold">{task.title}</h3>
      <span className={`rounded px-2 py-1 text-xs font-medium ${statusStyles[task.status]}`}>
        {task.status}
      </span>
    </div>
    <p className="mb-2 text-sm text-slate-700">{task.description || 'No description'}</p>
    <div className="text-xs text-slate-500">
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
        type="button"
        onClick={() => onToggleComplete(task)}
      >
        {task.completed ? 'Mark Pending' : 'Mark Completed'}
      </button>
      <button className="rounded border px-3 py-1 text-xs" type="button" onClick={() => onEdit(task)}>
        Edit
      </button>
      <button className="rounded border border-red-300 px-3 py-1 text-xs text-red-700" type="button" onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </div>
  </div>
);
