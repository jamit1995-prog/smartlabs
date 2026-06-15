import mongoose from 'mongoose';
import User from './models/User.js';

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/smartlab');
    const admins = await User.find({ role: 'admin' }).lean();
    console.log(JSON.stringify(admins.map(u => ({ email: u.email, password: u.password })), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
