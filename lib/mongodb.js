import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}

/**
 * Global cache to preserve the Mongoose connection across
 * hot-reloads in Next.js development mode.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  // Force DNS override immediately before connection in Next.js
  require('node:dns').setServers(['8.8.8.8', '8.8.4.4']);

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Connection Error in Next.js:', e);
    throw e;
  }
  return cached.conn;
}

export default connectDB;
