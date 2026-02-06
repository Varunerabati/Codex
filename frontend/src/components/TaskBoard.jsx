import { TaskCard } from './TaskCard';

const columns = ['Pending', 'Completed', 'Overdue'];

export const TaskBoard = ({ tasks, onToggleComplete, onEdit, onDelete }) => (
  <div className="grid gap-4 lg:grid-cols-3">
    {columns.map((column) => (
      <div key={column} className="rounded-lg bg-slate-100 p-3">
        <h2 className="mb-3 text-lg font-semibold">{column}</h2>
        <div className="space-y-3">
          {tasks
            .filter((task) => task.status === column)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          {tasks.every((task) => task.status !== column) && (
            <p className="rounded bg-white p-3 text-sm text-slate-500">No tasks</p>
          )}
        </div>
      </div>
    ))}
  </div>
);
