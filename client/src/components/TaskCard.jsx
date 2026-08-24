import { useState } from 'react';
import { PencilIcon, TrashIcon } from '../utils/icons';

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete, onSaveNotes }) {
  const [expanded, setExpanded] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes || '');

  function handleSave(e) {
    e.stopPropagation();
    onSaveNotes(task.id, notesDraft)?.catch?.((err) => console.error('Failed to save notes:', err.message));
    setExpanded(false);
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={task.completed}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggleComplete(task.id)}
          className="w-4 h-4 accent-sky-500 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${task.completed ? 'line-through text-black/40 dark:text-white/40' : ''}`}>
            {task.title}
          </p>
          <p className="text-xs text-black/50 dark:text-white/50">Due {task.dueDate}</p>
        </div>

        <PriorityBadge priority={task.priority} />

        <div className="flex items-center gap-3 ml-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="Edit task"
            className="text-black/60 dark:text-white/60 hover:text-sky-600"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            aria-label="Delete task"
            className="text-black/60 dark:text-white/60 hover:text-red-600"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="px-4 pb-4 border-t border-black/10 dark:border-white/10 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="block text-xs font-medium text-black/60 dark:text-white/60 mb-1">
            Notes
          </label>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={3}
            placeholder="Add details about this task..."
            className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSave}
              className="bg-sky-400 hover:bg-sky-500 text-black text-sm font-semibold px-4 py-1.5 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${styles[priority] || styles.low}`}>
      {priority}
    </span>
  );
}
