import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    console.log('Register route hit with body:', req.body);
    const { name, email, password } = req.body;
    console.log('Destructured values - name:', name, 'email:', email, 'password:', password);

    console.log('Searching for existing user...');
    const existingUser = await User.findOne({ email });
    console.log('Existing user check complete:', existingUser);

    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'client'
    });
    console.log('User created:', user);

    res.status(201).json({
      message: 'User Registered Successfully'
    });
  } catch (error) {
    console.error('Register error full:', error);
    console.error('Register error message:', error.message);
    console.error('Register error stack:', error.stack);
    res.status(500).json({
      message: error.message,
      stack: error.stack
    });
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  try {
    console.log('Login route hit with body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        message: 'Invalid password'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      'SECRET_KEY',
      {
        expiresIn: '7d'
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;
