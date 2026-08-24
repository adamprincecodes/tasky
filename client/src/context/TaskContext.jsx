import { createContext, useContext, useEffect, useState } from 'react';
import request from '../api/client';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

// Mongo returns _id; the rest of the app (TaskCard, MyTasks, Calendar...)
// was built around a plain `id` field, so normalize on the way in.
function normalize(task) {
  return { ...task, id: task._id };
}

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    request('/tasks')
      .then(({ tasks }) => setTasks(tasks.map(normalize)))
      .catch((err) => console.error('Failed to load tasks:', err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Propagates errors — used directly by the add/edit task modal, which
  // shows the message to the user.
  async function addTask(task) {
    const { task: created } = await request('/tasks', { method: 'POST', body: task });
    setTasks((prev) => [...prev, normalize(created)]);
  }

  async function updateTask(id, updates) {
    const { task: updated } = await request(`/tasks/${id}`, { method: 'PUT', body: updates });
    setTasks((prev) => prev.map((t) => (t.id === id ? normalize(updated) : t)));
  }

  // Quiet failures for the low-stakes, fire-and-forget interactions
  // (checkbox toggle, delete button) — just log rather than surfacing an
  // error UI for these.
  async function deleteTask(id) {
    try {
      await request(`/tasks/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err.message);
    }
  }

  async function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      await updateTask(id, { completed: !task.completed });
    } catch (err) {
      console.error('Failed to update task:', err.message);
    }
  }

  const value = { tasks, loading, addTask, updateTask, deleteTask, toggleComplete };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
