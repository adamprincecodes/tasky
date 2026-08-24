import { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';

function pad(n) {
  return String(n).padStart(2, '0');
}
function toKey(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export default function CalendarPage() {
  const { tasks } = useTasks();
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedDate, setSelectedDate] = useState(toKey(now.getFullYear(), now.getMonth(), now.getDate()));

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    });
    return map;
  }, [tasks]);

  const firstOfMonth = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();
  const cells = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function changeMonth(delta) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const selectedTasks = tasksByDate[selectedDate] || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
              ←
            </button>
            <h2 className="font-semibold">{monthLabel}</h2>
            <button onClick={() => changeMonth(1)} className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-black/50 dark:text-white/50 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const key = toKey(cursor.year, cursor.month, day);
              const count = tasksByDate[key]?.length || 0;
              const isSelected = key === selectedDate;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(key)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm border ${
                    isSelected
                      ? 'bg-sky-400 border-sky-400 font-semibold'
                      : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {day}
                  {count > 0 && <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-3">{selectedDate}</h3>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60">No tasks due this day.</p>
          ) : (
            <ul className="space-y-2">
              {selectedTasks.map((t) => (
                <li key={t.id} className="text-sm border border-black/10 dark:border-white/10 rounded-lg px-3 py-2">
                  <p className={t.completed ? 'line-through text-black/40 dark:text-white/40' : 'font-medium'}>
                    {t.title}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 capitalize">{t.priority} priority</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
