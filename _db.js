// api/_db.js — shared MongoDB connection (reused across serverless functions)
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectDB() {
  if (db) return db;
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  }
  await client.connect();
  db = client.db('din_app');
  // Ensure indexes
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('userdata').createIndex({ username: 1 }, { unique: true });
  return db;
}

module.exports = { connectDB };
