import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { logger } from '../utils/logger';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'fitforecast-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /auth/signup
 * Create a new user account
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`New user signed up: ${user.email}`);

    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      message: 'Internal server error during signup',
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`User logged in: ${user.email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login',
    });
  }
});

/**
 * GET /auth/me
 * Get current user info from token
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    // userId is set by requireAuth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

/**
 * POST /auth/logout
 * Logout (client-side token removal, but endpoint for consistency)
 */
router.post('/logout', (req: Request, res: Response) => {
  // With JWT, logout is primarily client-side (remove token)
  // This endpoint is here for consistency and future enhancements (e.g., token blacklist)
  logger.info(`User logged out: ${req.userId || 'unknown'}`);
  res.json({
    message: 'Logout successful',
  });
});

export default router;
