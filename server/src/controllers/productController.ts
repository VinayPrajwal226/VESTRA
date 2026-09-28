import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../services/db.ts';

export const productController = {
  getAll(req: Request, res: Response): void {
    try {
      const {
        category,
        search,
        size,
        color,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      } = req.query;

      const result = db.getProducts({
        category: category as string,
        search: search as string,
        size: size as string,
        color: color as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch products' });
    }
  },

  getByIdOrSlug(req: Request, res: Response): void {
    try {
      const { identifier } = req.params;
      let product = db.getProductById(identifier);
      if (!product) {
        product = db.getProductBySlug(identifier);
      }

      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      // Related products in same category
      const related = db
        .getProducts({ category: product.category, limit: 4 })
        .products.filter((p) => p.id !== product!.id)
        .slice(0, 3);

      res.json({ success: true, product, related });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch product' });
    }
  },

  create(req: AuthenticatedRequest, res: Response): void {
    try {
      const {
        title,
        subtitle,
        description,
        price,
        originalPrice,
        category,
        images,
        sizes,
        colors,
        stockCount,
        featured,
        materials,
        careInstructions,
        origin,
        fit,
      } = req.body;

      if (!title || !price || !category) {
        res.status(400).json({ success: false, message: 'Title, price, and category are required' });
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const parsedPrice = Number(price);
      const parsedStock = Number(stockCount || 10);

      const product = db.createProduct({
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        subtitle: subtitle || 'Modern Luxury Ready-to-Wear',
        description: description || 'Masterfully constructed luxury garment.',
        price: parsedPrice,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category: category.toLowerCase(),
        images: images && images.length ? images : ['/src/assets/images/product_cashmere_overcoat_1790603713161.jpg'],
        sizes: sizes || ['S', 'M', 'L'],
        colors: colors || [{ name: 'Black', hex: '#1C1917' }],
        inStock: parsedStock > 0,
        stockCount: parsedStock,
        featured: !!featured,
        materials: materials || '100% Premium Natural Fibers',
        careInstructions: careInstructions || 'Dry clean recommended.',
        origin: origin || 'Handcrafted in Europe',
        fit: fit || 'Tailored contemporary fit.',
      });

      res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to create product' });
    }
  },

  update(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      if (updates.price) updates.price = Number(updates.price);
      if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
      if (updates.stockCount !== undefined) {
        updates.stockCount = Number(updates.stockCount);
        updates.inStock = updates.stockCount > 0;
      }

      const updated = db.updateProduct(id, updates);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      res.json({ success: true, message: 'Product updated successfully', product: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to update product' });
    }
  },

  delete(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const deleted = db.deleteProduct(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to delete product' });
    }
  },

  addReview(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const { rating, comment, userName } = req.body;

      if (!rating || !comment) {
        res.status(400).json({ success: false, message: 'Rating and comment are required' });
        return;
      }

      const reviewerName = req.user?.name || userName || 'Verified Collector';
      const reviewerId = req.user?.id || 'anonymous';

      const updatedProduct = db.addProductReview(id, {
        userId: reviewerId,
        userName: reviewerName,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment,
      });

      if (!updatedProduct) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Review recorded successfully',
        product: updatedProduct,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to submit review' });
    }
  },
};
