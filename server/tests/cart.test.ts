import request from 'supertest';
import app from '../src/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Cart Routes', () => {
  let userToken: string;
  let productId: string;

  beforeEach(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    userToken = userResponse.body.data.token;

    // Create test product
    const product = await prisma.product.create({
      data: {
        title: 'Test Product',
        description: 'Test description',
        price: 100000,
        images: ['test.jpg'],
        category: 'electronics',
        specifications: {},
      },
    });

    productId = product.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId,
          quantity: 1,
        })
        .expect(201);

      expect(response.body.data.productId).toBe(productId);
      expect(response.body.data.quantity).toBe(1);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/cart')
        .send({
          productId,
          quantity: 1,
        })
        .expect(401);
    });
  });

  describe('GET /api/cart', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId,
          quantity: 2,
        });
    });

    it('should get user cart items', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].quantity).toBe(2);
    });
  });
});
