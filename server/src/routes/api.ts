import { Router } from 'express';
import { authController } from '../controllers/authController.ts';
import { categoryController } from '../controllers/categoryController.ts';
import { mediaController } from '../controllers/mediaController.ts';
import { orderController } from '../controllers/orderController.ts';
import { productController } from '../controllers/productController.ts';
import { statsController } from '../controllers/statsController.ts';
import { adminOnly, authMiddleware, optionalAuthMiddleware } from '../middleware/auth.ts';
import { upload } from '../middleware/upload.ts';

export const apiRouter = Router();

// --- Auth Routes ---
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.get('/auth/me', authMiddleware, authController.getMe);
apiRouter.put('/auth/profile', authMiddleware, authController.updateProfile);
apiRouter.post('/auth/forgot-password', authController.forgotPassword);
apiRouter.post('/auth/reset-password', authController.resetPassword);

// --- Product Routes ---
apiRouter.get('/products', productController.getAll);
apiRouter.get('/products/:identifier', productController.getByIdOrSlug);
apiRouter.post('/products', authMiddleware, adminOnly, productController.create);
apiRouter.put('/products/:id', authMiddleware, adminOnly, productController.update);
apiRouter.delete('/products/:id', authMiddleware, adminOnly, productController.delete);
apiRouter.post('/products/:id/reviews', optionalAuthMiddleware, productController.addReview);

// --- Category Routes ---
apiRouter.get('/categories', categoryController.getAll);
apiRouter.get('/categories/:slug', categoryController.getBySlug);
apiRouter.post('/categories', authMiddleware, adminOnly, categoryController.create);
apiRouter.put('/categories/:id', authMiddleware, adminOnly, categoryController.update);
apiRouter.delete('/categories/:id', authMiddleware, adminOnly, categoryController.delete);

// --- Order Routes ---
apiRouter.post('/orders', optionalAuthMiddleware, orderController.create);
apiRouter.get('/orders/my', authMiddleware, orderController.getMyOrders);
apiRouter.get('/orders/all', authMiddleware, adminOnly, orderController.getAll);
apiRouter.get('/orders/:id', optionalAuthMiddleware, orderController.getById);
apiRouter.put('/orders/:id/status', authMiddleware, adminOnly, orderController.updateStatus);

// --- Media & File Management (Upload, Download, Delete) ---
apiRouter.post('/media/upload', authMiddleware, adminOnly, upload.single('file'), mediaController.uploadFile);
apiRouter.get('/media', authMiddleware, adminOnly, mediaController.getAll);
apiRouter.get('/media/download/:id', mediaController.download);
apiRouter.delete('/media/:id', authMiddleware, adminOnly, mediaController.delete);

// --- Dashboard Analytics ---
apiRouter.get('/admin/stats', authMiddleware, adminOnly, statsController.getOverview);
