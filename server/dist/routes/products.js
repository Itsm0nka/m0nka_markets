import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
// Get all products with search and filter
router.get('/', async (req, res, next) => {
    try {
        const { q = '', category = '', page = '1', limit = '40', sortBy = 'createdAt', sortOrder = 'desc', } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;
        const where = {};
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = category;
        }
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: offset,
                take: limitNum,
            }),
            prisma.product.count({ where }),
        ]);
        const response = {
            data: products,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Get single product
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ data: product });
    }
    catch (error) {
        next(error);
    }
});
export default router;
