import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../services/db.ts';

export const categoryController = {
  getAll(_req: Request, res: Response): void {
    try {
      const categories = db.getCategories();
      res.json({ success: true, categories });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch categories' });
    }
  },

  getBySlug(req: Request, res: Response): void {
    try {
      const { slug } = req.params;
      const category = db.getCategoryBySlug(slug);
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      res.json({ success: true, category });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch category' });
    }
  },

  create(req: AuthenticatedRequest, res: Response): void {
    try {
      const { name, description, image } = req.body;
      if (!name) {
        res.status(400).json({ success: false, message: 'Category name is required' });
        return;
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const newCategory = db.createCategory({
        name,
        slug,
        description: description || 'Curated luxury collection.',
        image: image || '/src/assets/images/product_cashmere_overcoat_1790603713161.jpg',
      });

      res.status(201).json({ success: true, message: 'Category created successfully', category: newCategory });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to create category' });
    }
  },

  update(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const updated = db.updateCategory(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      res.json({ success: true, message: 'Category updated successfully', category: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to update category' });
    }
  },

  delete(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const deleted = db.deleteCategory(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      res.json({ success: true, message: 'Category removed successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to delete category' });
    }
  },
};
