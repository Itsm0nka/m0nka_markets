import express from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
const prisma = new PrismaClient();
// Create order (checkout)
router.post('/', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Get user's cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            const price = item.product.discountPrice || item.product.price;
            return sum + price * item.quantity;
        }, 0);
        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                status: OrderStatus.PENDING, // ✅ используем enum
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.discountPrice || item.product.price,
                    })),
                },
            },
            include: {
                items: { include: { product: true } },
            },
        });
        // Clear cart
        await prisma.cartItem.deleteMany({ where: { userId } });
        res.status(201).json({
            data: { orderId: order.id },
            message: 'Order created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get user's orders
router.get('/', authenticate, async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ data: orders });
    }
    catch (error) {
        next(error);
    }
});
export default router;
