const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

const timeEntrySchema = new mongoose.Schema({
  startTime: { type: Date },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // seconds
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  category: { type: String, trim: true, default: 'General' },
  tags: [{ type: String, trim: true }],
  dueDate: { type: Date, index: true },
  dueTime: { type: String, default: '' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  order: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subtasks: [subtaskSchema],
  comments: [commentSchema],
  timeEntries: [timeEntrySchema],
  totalTimeSpent: { type: Number, default: 0 }, // seconds
  isTimerRunning: { type: Boolean, default: false },
  timerStartedAt: { type: Date },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  recurring: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], default: 'daily' },
    interval: { type: Number, default: 1 },
  },
  project: { type: String, default: 'Personal' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

taskSchema.index({ dueDate: 1, owner: 1 });
taskSchema.index({ status: 1, owner: 1 });

module.exports = mongoose.model('Task', taskSchema);
