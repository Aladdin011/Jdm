import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../config/database';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Initialize user repository
    const userRepository = new UserRepository();

    // Find user by email
    const user = await userRepository.findByEmail(email);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login time
    await userRepository.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '24h' }
    );

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
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, company, department, isStaff } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
      });
    }

    // Initialize user repository
    const userRepository = new UserRepository();

    // Check if user already exists in database
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate department code for staff users
    let departmentCode = null;
    if (isStaff && department) {
      // Import the department code generator
      const { generateDepartmentCode } = require('../utils/departmentCodes');
      departmentCode = generateDepartmentCode(department);
    }

    // Create new user object
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      company: company || '',
      department: department || null,
      department_code: departmentCode,
      isActive: true,
      lastLogin: new Date()
    };

    // Save user to database
    const savedUser = await userRepository.create(newUser);
    console.log('New user registered and saved to database:', savedUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '24h' }
    );

    // Return user data without password and token
    const { password: _, ...userData } = savedUser;
    
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

// Get all department codes
router.get('/department-codes', (req, res) => {
  try {
    // Import the department codes utility
    const { listAllDepartmentCodes, getDepartmentDisplayName } = require('../utils/departmentCodes');
    
    // Get all department base codes
    const departmentCodes = listAllDepartmentCodes();
    
    // Format the response with department names and codes
    const formattedResponse = Object.entries(departmentCodes).map(([deptId, baseCode]) => ({
      id: deptId,
      name: getDepartmentDisplayName(deptId),
      baseCode: baseCode,
      codeRange: `${baseCode}-${Number(baseCode) + 999}`
    }));
    
    return res.status(200).json({
      success: true,
      data: formattedResponse
    });
  } catch (error) {
    console.error('Error fetching department codes:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;