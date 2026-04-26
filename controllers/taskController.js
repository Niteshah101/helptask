const Task = require('../models/Task');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const taskObserver = require('../observers/taskObserver');

exports.home = async (req, res) => {
  try {
    const tasks = await Task.findActive();
    for (const task of tasks) {
      task.owner = await User.findById(task.ownerId);
    }
    res.render('index', { tasks, message: req.query.message || null });
  } catch (error) {
    console.error('Home error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.dashboard = async (req, res) => {
  try {
    const tasks = await Task.findByOwner(req.session.user.id);
    for (const task of tasks) {
      task.volunteers = await Volunteer.findSubscribedByTask(task._id);
    }
    res.render('dashboard', { tasks });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.showCreateTask = (req, res) => {
  res.render('create-task', { error: null });
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title || !description) {
      return res.render('create-task', { error: 'Title and description are required.' });
    }

    const task = await Task.create({ title, description, location, ownerId: req.session.user.id });

    taskObserver.notify('TASK_CREATED', {
      taskId: task._id.toString(),
      title: task.title,
      owner: req.session.user.email
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Create task error:', error);
    res.render('create-task', { error: 'Could not create task.' });
  }
};

exports.volunteer = async (req, res) => {
  try {
    const { taskId } = req.params;
    const identifier = req.body.identifier;

    const task = await Task.findById(taskId);
    if (!task || !task.active) {
      return res.status(404).send('Task not found or inactive.');
    }

    if (!identifier) {
      return res.status(400).send('Email or unique identifier is required.');
    }

    await Volunteer.subscribe(taskId, identifier);

    taskObserver.notify('VOLUNTEER_SUBSCRIBED', {
      taskId,
      identifier
    });

    res.redirect('/?message=Subscribed successfully');
  } catch (error) {
    console.error('Volunteer error:', error);
    res.status(500).send('Could not subscribe to task.');
  }
};

exports.showMySubscriptions = (req, res) => {
  res.render('my-subscriptions', { subscriptions: null, identifier: '', error: null });
};

exports.mySubscriptions = async (req, res) => {
  try {
    const identifier = req.body.identifier;
    if (!identifier) {
      return res.render('my-subscriptions', {
        subscriptions: [],
        identifier: '',
        error: 'Please enter your email or unique identifier.'
      });
    }

    const subscriptions = await Volunteer.findByIdentifier(identifier);
    res.render('my-subscriptions', { subscriptions, identifier, error: null });
  } catch (error) {
    console.error('Subscriptions error:', error);
    res.status(500).send('Could not load subscriptions.');
  }
};

exports.dismissVolunteer = async (req, res) => {
  try {
    const { taskId, identifier } = req.params;
    const task = await Task.findByIdAndOwner(taskId, req.session.user.id);
    if (!task) {
      return res.status(403).send('Unauthorized or task not found.');
    }

    await Volunteer.dismiss(taskId, identifier);

    taskObserver.notify('VOLUNTEER_DISMISSED', {
      taskId,
      identifier,
      owner: req.session.user.email
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Dismiss volunteer error:', error);
    res.status(500).send('Could not dismiss volunteer.');
  }
};

exports.closeTask = async (req, res) => {
  try {
    await Task.close(req.params.taskId, req.session.user.id);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Close task error:', error);
    res.status(500).send('Could not close task.');
  }
};

exports.stats = async (req, res) => {
  try {
    const stats = await Volunteer.statsForActiveTasks();
    res.render('stats', { stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).send('Could not load stats.');
  }
};
