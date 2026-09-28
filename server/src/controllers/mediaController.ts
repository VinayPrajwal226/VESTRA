import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { UPLOADS_DIR } from '../middleware/upload.ts';
import { db } from '../services/db.ts';

export const mediaController = {
  uploadFile(req: AuthenticatedRequest, res: Response): void {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const file = req.file;
      const media = db.addMedia({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        media,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'File upload failed' });
    }
  },

  getAll(_req: Request, res: Response): void {
    try {
      const media = db.getMedia();
      res.json({ success: true, media });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch media' });
    }
  },

  download(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const media = db.getMediaById(id);

      if (!media) {
        res.status(404).json({ success: false, message: 'File not found' });
        return;
      }

      const filePath = path.join(UPLOADS_DIR, media.filename);

      if (fs.existsSync(filePath)) {
        res.download(filePath, media.originalName);
      } else {
        // Fallback if it was a seed asset
        const cleanPath = media.url.startsWith('/') ? media.url.slice(1) : media.url;
        const projectPath = path.resolve(process.cwd(), cleanPath);
        if (fs.existsSync(projectPath)) {
          res.download(projectPath, media.originalName);
        } else {
          res.status(404).json({ success: false, message: 'File not located on disk' });
        }
      }
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Download failed' });
    }
  },

  delete(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const media = db.getMediaById(id);

      if (!media) {
        res.status(404).json({ success: false, message: 'File not found' });
        return;
      }

      const filePath = path.join(UPLOADS_DIR, media.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not remove file from disk:', e);
        }
      }

      db.deleteMedia(id);
      res.json({ success: true, message: 'File deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'File deletion failed' });
    }
  },
};
