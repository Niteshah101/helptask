const { MongoClient } = require('mongodb');

let clientInstance = null;
let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || 'helpersDB';

  if (!uri) {
    throw new Error('MONGO_URI is missing. Add it in Render Environment Variables.');
  }

  clientInstance = new MongoClient(uri);
  await clientInstance.connect();
  dbInstance = clientInstance.db(dbName);

  await dbInstance.collection('users').createIndex({ email: 1 }, { unique: true });
  await dbInstance.collection('volunteers').createIndex({ taskId: 1, identifier: 1 }, { unique: true });

  console.log(`MongoDB connected to database: ${dbName}`);
  return dbInstance;
}

function getDB() {
  if (!dbInstance) {
    throw new Error('Database not connected yet. Call connectDB first.');
  }
  return dbInstance;
}

module.exports = { connectDB, getDB };
