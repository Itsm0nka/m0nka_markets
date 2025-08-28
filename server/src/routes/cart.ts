import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient, CartItem } from '@prisma/client';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate, addToCartSchema, updateQuantitySchema } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Тип для корзины с продуктом
type CartItemWithProduct = CartItem & { product: any };

// Получить корзину пользователя
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: cartItems });
  } catch (error) {
    next(error);
  }
});

// Добавить товар в корзину
router.post('/', authenticate, validate(addToCartSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.id;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.inStock) return res.status(400).json({ message: 'Product is out of stock' });

    const existingItem = await prisma.cartItem.findFirst({ where: { userId, productId } });

    let cartItem: CartItemWithProduct;

    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity },
        include: { product: true },
      });
    }

    res.status(201).json({ data: cartItem, message: 'Item added to cart successfully' });
  } catch (error) {
    next(error);
  }
});

// Обновить количество товара в корзине
router.patch('/:id', authenticate, validate(updateQuantitySchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.id;

    const existingItem = await prisma.cartItem.findFirst({ where: { id, userId } });
    if (!existingItem) return res.status(404).json({ message: 'Cart item not found' });

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    res.json({ data: cartItem, message: 'Cart item updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Удалить товар из корзины
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existingItem = await prisma.cartItem.findFirst({ where: { id, userId } });
    if (!existingItem) return res.status(404).json({ message: 'Cart item not found' });

    await prisma.cartItem.delete({ where: { id } });

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
