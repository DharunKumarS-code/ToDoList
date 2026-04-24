const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTasks, getTask, createTask, updateTask, deleteTask,
  bulkAction, addSubtask, updateSubtask, deleteSubtask,
  addComment, startTimer, stopTimer, reorderTasks,
  getCalendarTasks, getAnalytics,
} = require('../controllers/taskController');

// Inject socket.io into req
router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.get('/calendar', protect, getCalendarTasks);
router.get('/analytics', protect, getAnalytics);
router.put('/reorder', protect, reorderTasks);
router.post('/bulk', protect, bulkAction);

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').get(protect, getTask).put(protect, updateTask).delete(protect, deleteTask);

router.post('/:id/subtasks', protect, addSubtask);
router.put('/:id/subtasks/:subId', protect, updateSubtask);
router.delete('/:id/subtasks/:subId', protect, deleteSubtask);

router.post('/:id/comments', protect, addComment);
router.post('/:id/timer/start', protect, startTimer);
router.post('/:id/timer/stop', protect, stopTimer);

module.exports = router;
