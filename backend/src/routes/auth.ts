import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock users database
const users = [
  {
    id: '1',
    email: 'admin@jdmarcng.com',
    password: 'admin123', // In production, this would be hashed
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    company: 'JD Marc Limited',
    isVerified: true,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123', // In production, this would be hashed
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    company: 'Example Corp',
    isVerified: true,
  },
];

// Login route
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = users.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate mock token
    const token = `mock-jwt-token-${uuidv4()}`;

    // Return user data and token
    const { password: _, ...userData } = user;
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Register route
router.post('/register', (req, res) => {
  try {
    const { email, password, firstName, lastName, company } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
      });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password, // In production, this would be hashed
      firstName,
      lastName,
      role: 'user',
      company: company || '',
      isVerified: false,
    };

    // In a real app, we would save to database
    // For mock purposes, we'll just log it
    console.log('New user registered:', newUser);

    // Generate mock token
    const token = `mock-jwt-token-${uuidv4()}`;

    // Return user data without password and token
    const { password: _, ...userData } = newUser;
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;