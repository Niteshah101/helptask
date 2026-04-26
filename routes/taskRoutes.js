const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/', taskController.home);
router.get('/dashboard', requireLogin, taskController.dashboard);
router.get('/tasks/new', requireLogin, taskController.showCreateTask);
router.post('/tasks/new', requireLogin, taskController.createTask);
router.post('/volunteer/:taskId', taskController.volunteer);
router.get('/my-subscriptions', taskController.showMySubscriptions);
router.post('/my-subscriptions', taskController.mySubscriptions);
router.post('/dismiss/:taskId/:identifier', requireLogin, taskController.dismissVolunteer);
router.post('/tasks/:taskId/close', requireLogin, taskController.closeTask);
router.get('/stats', taskController.stats);

module.exports = router;
