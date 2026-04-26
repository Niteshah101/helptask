# Helpers System

Node.js + Express + MongoDB Atlas volunteering system.

## Patterns implemented

- MVC: routes, controllers, models, views separated.
- Observer: `observers/taskObserver.js` receives task/volunteer events.
- Singleton: `config/db.js` keeps one MongoDB client/database instance.

## Render environment variables

Add these in Render Dashboard -> Your Web Service -> Environment:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=helpersDB
SESSION_SECRET=replace-with-long-random-secret
NODE_ENV=production
```

MongoDB Atlas Network Access should allow Render. For testing, add `0.0.0.0/0`.

## Render settings

- Build Command: `npm install`
- Start Command: `npm start`

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Main routes

- `/` active tasks and volunteer forms
- `/register` owner account registration
- `/login` owner login
- `/dashboard` owner dashboard with volunteers and dismiss buttons
- `/tasks/new` create task
- `/my-subscriptions` volunteer lookup by identifier
- `/stats` current volunteer counts for active tasks
