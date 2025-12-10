import express from 'express';
import { getCart, updateCart, mergeCart } from '../controllers/user.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/cart', protect, getCart);
router.put('/cart', protect, updateCart);
router.post('/cart/merge', protect, mergeCart);

export default router;
