import { useEffect, useState } from 'react';

const empty = { title: '', dueDate: '', priority: 'medium' };

export default function TaskModal({ open, onClose, onSubmit, initialTask, error }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        dueDate: initialTask.dueDate,
        priority: initialTask.priority,
      });
    } else {
      setForm(empty);
    }
  }, [initialTask, open]);

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-cream text-black rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">{initialTask ? 'Edit task' : 'Add task'}</h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-black/20 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <label className="block text-sm font-medium mb-1" htmlFor="dueDate">
          Due date
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-black/20 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <label className="block text-sm font-medium mb-1" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full mb-6 px-3 py-2 rounded-lg border border-black/20 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-black/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-sky-400 hover:bg-sky-500 font-semibold"
          >
            {initialTask ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </form>
    </div>
  );
}
