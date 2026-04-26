const User = require('../models/User');

exports.showRegister = (req, res) => {
  res.render('register', { error: null });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render('register', { error: 'All fields are required.' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.render('register', { error: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password });
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Register error:', error);
    res.render('register', { error: 'Could not create account.' });
  }
};

exports.showLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email || '');

    if (!user || !(await User.validatePassword(user, password || ''))) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Could not log in.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
