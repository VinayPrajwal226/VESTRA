import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWT_SECRET } from '../middleware/auth.ts';
import { db } from '../services/db.ts';

export const authController = {
  register(req: Request, res: Response): void {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        return;
      }

      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ success: false, message: 'An account with this email already exists' });
        return;
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = db.createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'customer',
      });

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const { password: _, ...userSafe } = newUser;
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: userSafe,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Registration failed' });
    }
  },

  login(req: Request, res: Response): void {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const user = db.findUserByEmail(email);
      if (!user || !user.password) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const { password: _, ...userSafe } = user;
      res.json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: userSafe,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Sign in failed' });
    }
  },

  getMe(req: AuthenticatedRequest, res: Response): void {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const { password: _, ...userSafe } = req.user;
    res.json({ success: true, user: userSafe });
  },

  updateProfile(req: AuthenticatedRequest, res: Response): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { name, phone, address } = req.body;
      const updated = db.updateUser(req.user.id, {
        ...(name ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address ? { address } : {}),
      });

      if (!updated) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const { password: _, ...userSafe } = updated;
      res.json({ success: true, message: 'Profile updated successfully', user: userSafe });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Profile update failed' });
    }
  },

  forgotPassword(req: Request, res: Response): void {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required' });
      return;
    }
    const user = db.findUserByEmail(email);
    // Return friendly response even if email doesn't exist for security
    res.json({
      success: true,
      message: 'If an account exists with this email, a reset code has been sent.',
      demoToken: user ? `RESET-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
    });
  },

  resetPassword(req: Request, res: Response): void {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Email and new password are required' });
      return;
    }
    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(404).json({ success: false, message: 'Account not found' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.updateUser(user.id, { password: hashedPassword });
    res.json({ success: true, message: 'Password has been reset successfully. You may now sign in.' });
  },
};
