require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    const mongoUrl = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME || 'helpersDB';

    if (!mongoUrl) {
      throw new Error('MONGO_URI is missing. Add it in Render Environment Variables.');
    }

    await connectDB();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(session({
      secret: process.env.SESSION_SECRET || 'change-this-secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl, dbName, collectionName: 'sessions' }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
      }
    }));

    app.use((req, res, next) => {
      res.locals.user = req.session.user || null;
      next();
    });

    app.use('/', authRoutes);
    app.use('/', taskRoutes);

    app.use((req, res) => {
      res.status(404).render('404');
    });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
