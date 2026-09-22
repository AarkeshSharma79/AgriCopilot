import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(MONGO_URI, {
      // Modern mongoose (6+) no longer needs useNewUrlParser/useUnifiedTopology,
      // kept here as a comment for teams on older drivers.
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Drop the old phone index if it exists since phone is no longer required or unique
    try {
      await mongoose.connection.collection('users').dropIndex('phone_1');
      console.log('Successfully dropped old phone_1 index from users collection.');
    } catch (err) {
      if (err.code !== 27) { // 27 = IndexNotFound
        console.warn('Could not drop phone_1 index (it may not exist):', err.message);
      }
    }

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect is handled by the driver.');
    });

    return conn;
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
