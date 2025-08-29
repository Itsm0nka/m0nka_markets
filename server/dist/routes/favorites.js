import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { validate, addToFavoritesSchema } from '../middleware/validation.js';
const router = express.Router();
const prisma = new PrismaClient();
// Get user's favorites
router.get('/', authenticate, async (req, res, next) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            include: {
                product: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ data: favorites });
    }
    catch (error) {
        next(error);
    }
});
// Add item to favorites
router.post('/', authenticate, validate(addToFavoritesSchema), async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if item already exists in favorites
        const existingFavorite = await prisma.favorite.findFirst({
            where: { userId, productId },
        });
        if (existingFavorite) {
            return res.status(409).json({ message: 'Product already in favorites' });
        }
        const favorite = await prisma.favorite.create({
            data: { userId, productId },
            include: { product: true },
        });
        res.status(201).json({
            data: favorite,
            message: 'Item added to favorites successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Remove item from favorites
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const existingFavorite = await prisma.favorite.findFirst({
            where: { id, userId },
        });
        if (!existingFavorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        await prisma.favorite.delete({
            where: { id },
        });
        res.json({ message: 'Item removed from favorites successfully' });
    }
    catch (error) {
        next(error);
    }
});
export default router;
