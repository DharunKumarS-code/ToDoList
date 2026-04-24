const Task = require('../models/Task');

const buildFilter = (query, userId) => {
  const filter = { owner: userId, isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;
  if (query.project) filter.project = query.project;
  if (query.search) filter.title = { $regex: query.search, $options: 'i' };
  if (query.tag) filter.tags = query.tag;
  if (query.startDate || query.endDate) {
    filter.dueDate = {};
    if (query.startDate) filter.dueDate.$gte = new Date(query.startDate);
    if (query.endDate) filter.dueDate.$lte = new Date(query.endDate);
  }
  return filter;
};

// GET /tasks
const getTasks = async (req, res) => {
  try {
    const filter = buildFilter(req.query, req.user._id);
    const sort = req.query.sort || 'order';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit).populate('assignedTo', 'name email avatar').populate('comments.user', 'name avatar'),
      Task.countDocuments(filter),
    ]);

    res.json({ success: true, total, page, pages: Math.ceil(total / limit), tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false })
      .populate('assignedTo', 'name email avatar')
      .populate('comments.user', 'name avatar');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tasks
const createTask = async (req, res) => {
  try {
    const taskCount = await Task.countDocuments({ owner: req.user._id, isDeleted: false });
    const task = await Task.create({ ...req.body, owner: req.user._id, order: taskCount });
    req.io?.emit('task:created', task);
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email avatar');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    req.io?.emit('task:updated', task);
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    req.io?.emit('task:deleted', { id: req.params.id });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tasks/bulk
const bulkAction = async (req, res) => {
  try {
    const { ids, action, data } = req.body;
    let update = {};
    if (action === 'complete') update = { status: 'done', progress: 100 };
    else if (action === 'delete') update = { isDeleted: true };
    else if (action === 'move') update = { status: data.status };
    else if (action === 'priority') update = { priority: data.priority };

    await Task.updateMany({ _id: { $in: ids }, owner: req.user._id }, update);
    res.json({ success: true, message: `Bulk ${action} applied` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tasks/:id/subtasks
const addSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.subtasks.push({ title: req.body.title });
    await task.save();
    res.json({ success: true, subtasks: task.subtasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /tasks/:id/subtasks/:subId
const updateSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const sub = task.subtasks.id(req.params.subId);
    if (!sub) return res.status(404).json({ success: false, message: 'Subtask not found' });
    Object.assign(sub, req.body);
    // auto-update progress
    const total = task.subtasks.length;
    const done = task.subtasks.filter(s => s.completed).length;
    task.progress = total > 0 ? Math.round((done / total) * 100) : 0;
    await task.save();
    res.json({ success: true, subtasks: task.subtasks, progress: task.progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /tasks/:id/subtasks/:subId
const deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.subtasks.pull(req.params.subId);
    await task.save();
    res.json({ success: true, subtasks: task.subtasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tasks/:id/comments
const addComment = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.comments.push({ user: req.user._id, text: req.body.text });
    await task.save();
    await task.populate('comments.user', 'name avatar');
    res.json({ success: true, comments: task.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tasks/:id/timer/start
const startTimer = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.isTimerRunning = true;
    task.timerStartedAt = new Date();
    await task.save();
    res.json({ success: true, isTimerRunning: true, timerStartedAt: task.timerStartedAt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tasks/:id/timer/stop
const stopTimer = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
    if (!task || !task.isTimerRunning) return res.status(400).json({ success: false, message: 'Timer not running' });
    const duration = Math.floor((Date.now() - new Date(task.timerStartedAt).getTime()) / 1000);
    task.timeEntries.push({ startTime: task.timerStartedAt, endTime: new Date(), duration });
    task.totalTimeSpent += duration;
    task.isTimerRunning = false;
    task.timerStartedAt = null;
    await task.save();
    res.json({ success: true, totalTimeSpent: task.totalTimeSpent, timeEntries: task.timeEntries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /tasks/reorder
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // [{ id, order }]
    await Promise.all(tasks.map(t => Task.findByIdAndUpdate(t.id, { order: t.order })));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /calendar
const getCalendarTasks = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {
      owner: req.user._id,
      isDeleted: false,
      dueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };
    const tasks = await Task.find(filter).select('title priority status dueDate progress');
    // Group by date string
    const grouped = tasks.reduce((acc, task) => {
      const key = task.dueDate.toISOString().split('T')[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
    res.json({ success: true, grouped, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, done, inprogress, todo, overdue, byPriority] = await Promise.all([
      Task.countDocuments({ owner: userId, isDeleted: false }),
      Task.countDocuments({ owner: userId, isDeleted: false, status: 'done' }),
      Task.countDocuments({ owner: userId, isDeleted: false, status: 'inprogress' }),
      Task.countDocuments({ owner: userId, isDeleted: false, status: 'todo' }),
      Task.countDocuments({ owner: userId, isDeleted: false, status: { $ne: 'done' }, dueDate: { $lt: new Date() } }),
      Task.aggregate([
        { $match: { owner: userId, isDeleted: false } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);
    res.json({ success: true, analytics: { total, done, inprogress, todo, overdue, byPriority, completionRate: total > 0 ? Math.round((done / total) * 100) : 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, bulkAction, addSubtask, updateSubtask, deleteSubtask, addComment, startTimer, stopTimer, reorderTasks, getCalendarTasks, getAnalytics };
