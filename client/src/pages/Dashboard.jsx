import { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { tasks, toggleComplete } = useTasks();
  const { user } = useAuth();
  const today = todayStr();

  const dueToday = useMemo(() => tasks.filter((t) => t.dueDate === today), [tasks, today]);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Here's what's on your plate today.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatBlock label="Total tasks" value={total} />
        <StatBlock label="Completed" value={completed} />
        <StatBlock label="Completion rate" value={`${pct}%`} />
      </div>

      <div className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-4 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Overall progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-sky-400" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Due today</h2>
      {dueToday.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">
          Nothing due today — enjoy the breathing room.
        </p>
      ) : (
        <ul className="space-y-2">
          {dueToday.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="w-4 h-4 accent-sky-500"
              />
              <span className={task.completed ? 'line-through text-black/40 dark:text-white/40' : ''}>
                {task.title}
              </span>
              <span
                className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : task.priority === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-5">
      <p className="text-sm text-black/60 dark:text-white/60 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
