const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();

// Salt rounds for bcrypt
const SALT_ROUNDS = 10;

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    console.log('Register request received:', {
        body: req.body,
        rawBody: req.rawBody ? req.rawBody.toString() : 'none',
        contentType: req.get('Content-Type'),
        method: req.method,
        url: req.url
    });
    
    // Handle case where body might be empty or malformed
    let email, password, role = 'user';
    
    if (req.body && typeof req.body === 'object') {
        ({ email, password, role = 'user' } = req.body);
    } else if (req.rawBody) {
        try {
            const parsed = JSON.parse(req.rawBody.toString());
            ({ email, password, role = 'user' } = parsed);
        } catch (e) {
            console.log('Failed to parse raw body:', e.message);
        }
    }

    try {
        // Validate input
        if (!email || !password) {
            console.log('Validation failed - missing fields:', { 
                email: !!email, 
                password: !!password,
                bodyExists: !!req.body,
                bodyType: typeof req.body,
                bodyKeys: req.body ? Object.keys(req.body) : 'no body',
                rawBodyExists: !!req.rawBody
            });
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
                debug: {
                    receivedEmail: !!email,
                    receivedPassword: !!password,
                    bodyType: typeof req.body
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        );

        console.log(`✅ New user registered: ${email} (ID: ${result.insertId})`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: result.insertId,
                email: email,
                role: role
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        
        // Handle specific MySQL errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

/**
 * Step 1: Verify email and password
 * POST /api/auth/verify-credentials
 */
router.post('/verify-credentials', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const [users] = await pool.execute(
            'SELECT id, email, password, role, department, department_code, code_expires_at FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log(`❌ Failed login attempt for: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log(`✅ Password verified for: ${email}`);

        // Check if user is staff and needs department code verification
        const requiresDepartmentCode = user.role === 'staff';

        res.json({
            success: true,
            requiresDepartmentCode,
            userId: user.id,
            department: user.department,
            message: requiresDepartmentCode ? 'Password verified. Please enter your department code.' : 'Login successful'
        });

    } catch (error) {
        console.error('❌ Error during credential verification:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

/**
 * Step 2: Verify department code (for staff only)
 * POST /api/auth/verify-department-code
 */
router.post('/verify-department-code', async (req, res) => {
    const { userId, departmentCode } = req.body;

    try {
        // Validate input
        if (!userId || !departmentCode) {
            return res.status(400).json({
                success: false,
                message: 'User ID and department code are required'
            });
        }

        // Find user by ID
        const [users] = await pool.execute(
            'SELECT id, email, role, department, department_code, code_expires_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user'
            });
        }

        const user = users[0];

        // Check if department code matches
        if (user.department_code !== departmentCode) {
            console.log(`❌ Invalid department code for user: ${user.email}`);
            return res.status(401).json({
                success: false,
                message: 'invalid code'
            });
        }

        // Check if code has expired
        if (user.code_expires_at && new Date() > new Date(user.code_expires_at)) {
            console.log(`❌ Expired department code for user: ${user.email}`);
            return res.status(401).json({
                success: false,
                message: 'expired code'
            });
        }

        console.log(`✅ Department code verified for: ${user.email}`);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role,
                department: user.department
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department: user.department
            },
            dashboard: user.department,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('❌ Error during department code verification:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during verification'
        });
    }
});

/**
 * Complete login for non-staff users (admin/general)
 * POST /api/auth/complete-login
 */
router.post('/complete-login', async (req, res) => {
    const { userId } = req.body;

    try {
        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Find user by ID
        const [users] = await pool.execute(
            'SELECT id, email, role, department FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user'
            });
        }

        const user = users[0];

        console.log(`✅ Complete login for: ${user.email}`);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role,
                department: user.department
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department: user.department
            },
            dashboard: user.department,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('❌ Error during complete login:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

/**
 * Legacy login endpoint (kept for backward compatibility)
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    const { email, password, identifier } = req.body;
    
    // Use identifier if provided, otherwise use email (for backward compatibility)
    const loginIdentifier = identifier || email;

    try {
        // Validate input
        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Department Code and password are required'
            });
        }

        // Find user by email OR department_code
        const [users] = await pool.execute(
            'SELECT id, email, password, role, department, department_code, created_at FROM users WHERE email = ? OR department_code = ?',
            [loginIdentifier, loginIdentifier]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log(`❌ Failed login attempt for: ${loginIdentifier}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role,
                department: user.department
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`✅ Successful login: ${loginIdentifier} (ID: ${user.id}, Department: ${user.department})`);

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            dashboard: user.department,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department: user.department,
                department_code: user.department_code,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

/**
 * Get current user info (requires authentication)
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, email, role, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('❌ Get user info error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * Middleware to authenticate JWT token
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
}

module.exports = router;
