import { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { PlusIcon } from '../utils/icons';

const statusFilters = ['all', 'pending', 'completed'];
const priorityFilters = ['all', 'low', 'medium', 'high'];

export default function MyTasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalError, setModalError] = useState('');

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (status === 'completed' && !t.completed) return false;
      if (status === 'pending' && t.completed) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      return true;
    });
  }, [tasks, status, priority]);

  function openAdd() {
    setEditingTask(null);
    setModalError('');
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setModalError('');
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    try {
      if (editingTask) await updateTask(editingTask.id, form);
      else await addTask(form);
      setModalOpen(false);
    } catch (err) {
      setModalError(err.message);
    }
  }

  return (
    <div className="relative min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <FilterGroup label="Status" value={status} options={statusFilters} onChange={setStatus} />
        <FilterGroup label="Priority" value={priority} options={priorityFilters} onChange={setPriority} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">No tasks match these filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              onSaveNotes={(id, notes) => updateTask(id, { notes })}
            />
          ))}
        </div>
      )}

      <button
        onClick={openAdd}
        aria-label="Add task"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-sky-400 hover:bg-sky-500 text-black shadow-lg flex items-center justify-center"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialTask={editingTask}
        error={modalError}
      />
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-black/60 dark:text-white/60">{label}:</span>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-sm px-3 py-1 rounded-full border ${
              value === opt
                ? 'bg-sky-400 border-sky-400 text-black font-semibold'
                : 'border-black/20 dark:border-white/20 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
