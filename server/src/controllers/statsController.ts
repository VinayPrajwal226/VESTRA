import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../services/db.ts';

export const statsController = {
  getOverview(_req: AuthenticatedRequest, res: Response): void {
    try {
      const stats = db.getDashboardStats();
      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch statistics' });
    }
  },
};
