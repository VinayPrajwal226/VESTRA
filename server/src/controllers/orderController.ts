import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../services/db.ts';

export const orderController = {
  create(req: AuthenticatedRequest, res: Response): void {
    try {
      const {
        items,
        shippingAddress,
        customerName,
        customerEmail,
        paymentMethod,
        promoCode,
      } = req.body;

      if (!items || !items.length) {
        res.status(400).json({ success: false, message: 'Cart items are required' });
        return;
      }

      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
        res.status(400).json({ success: false, message: 'Valid shipping address is required' });
        return;
      }

      const resolvedName = req.user?.name || customerName || 'Collector';
      const resolvedEmail = req.user?.email || customerEmail || 'client@vestra.com';

      // Calculate subtotal
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.price * (item.quantity || 1),
        0
      );

      // Promo discount calculation (e.g. VESTRA10 for 10% off)
      let discount = 0;
      if (promoCode && promoCode.toUpperCase() === 'VESTRA10') {
        discount = Math.round(subtotal * 0.1 * 100) / 100;
      } else if (promoCode && promoCode.toUpperCase() === 'ATELIER') {
        discount = 50;
      }

      // Free shipping over $300
      const shippingFee = subtotal >= 300 ? 0 : 25;
      const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
      const total = Math.max(0, Math.round((subtotal - discount + shippingFee + tax) * 100) / 100);

      const order = db.createOrder({
        userId: req.user?.id,
        customerName: resolvedName,
        customerEmail: resolvedEmail,
        shippingAddress,
        items,
        subtotal,
        shippingFee,
        discount,
        tax,
        total,
        status: 'Processing',
        paymentMethod: paymentMethod || 'credit_card',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        promoCode,
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to place order' });
    }
  },

  getMyOrders(req: AuthenticatedRequest, res: Response): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      const orders = db.getOrders(req.user.id);
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch orders' });
    }
  },

  getAll(req: AuthenticatedRequest, res: Response): void {
    try {
      const orders = db.getOrders();
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch orders' });
    }
  },

  getById(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const order = db.getOrderById(id);

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      // Check ownership if user is logged in and not admin
      if (req.user && req.user.role !== 'admin' && order.userId && order.userId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }

      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch order' });
    }
  },

  updateStatus(req: AuthenticatedRequest, res: Response): void {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;

      if (!status) {
        res.status(400).json({ success: false, message: 'Status is required' });
        return;
      }

      const updated = db.updateOrderStatus(id, status, trackingNumber);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      res.json({ success: true, message: 'Order status updated', order: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to update order status' });
    }
  },
};
