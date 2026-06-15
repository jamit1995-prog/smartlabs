import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import User from './models/User.js';

import authRoutes from './routes/auth.js';
import materialRoutes from './routes/materials.js';
import bookingRoutes from './routes/bookings.js';
import uploadRoutes from './routes/upload.js';
import printerRoutes from './routes/printers.js';
import quoteRoutes from './routes/quote.js';
import liveRoutes from './routes/live.js';

const app = express();
const uploadsDirectory = path.resolve('uploads');

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDirectory));

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/smartlab')
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    await seedAdminUser();
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error');
    console.error(err);
  });

async function seedAdminUser() {
  const adminEmail = 'admin@smartlab.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  const hashedPassword = await bcrypt.hash('admin123', 10);

  if (existingAdmin) {
    const storedPassword = existingAdmin.password || '';
    if (!storedPassword.startsWith('$2')) {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Existing admin password normalized to bcrypt hash');
    } else {
      console.log('✅ Admin user already exists');
    }
    return;
  }

  await User.create({
    name: 'Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin'
  });

  console.log(`✅ Default admin user created: ${adminEmail} / admin123`);
}

// Test Route
app.get('/', (req, res) => {
  res.send('Backend Running Successfully');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/printers', printerRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/live', liveRoutes);

// Start Server
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});