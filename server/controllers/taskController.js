import Task from '../models/Task.js';

export async function getTasks(req, res) {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json({ tasks });
}

export async function createTask(req, res) {
  try {
    const { title, dueDate, priority } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required.' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      dueDate,
      priority: priority || 'medium',
    });
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Could not create task.' });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const { title, dueDate, priority, completed, notes } = req.body;
    if (title !== undefined) task.title = title;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;
    if (notes !== undefined) task.notes = notes;

    await task.save();
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Could not update task.' });
  }
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted.' });
}
