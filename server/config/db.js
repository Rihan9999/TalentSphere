import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talentsphere';

  try {
    console.log(`[DB] Connecting to MongoDB Atlas / Instance...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ [DB] Connected to MongoDB Atlas / Database successfully.');
    return;
  } catch (err) {
    console.warn(`[DB] Primary MongoDB URI connection failed: ${err.message}`);
  }

  // Attempt embedded MongoMemoryServer fallback
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    console.log('[DB] Starting embedded MongoMemoryServer instance...');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    isConnected = true;
    console.log(`✅ [DB] Connected to embedded MongoMemoryServer at: ${memoryUri}`);
    return;
  } catch (memErr) {
    console.warn('[DB] MongoMemoryServer not available or binary download failed:', memErr.message);
  }

  // Final fallback: Disable Mongoose query buffering so app doesn't hang
  mongoose.set('bufferCommands', false);
  console.warn('⚠️ [DB] Warning: Operating without active MongoDB connection. Start mongod for live database persistence.');
};

export const getDbStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'MongoDB Connected' : 'Disconnected (Start mongod)',
});
