import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding products...');

  // Удаляем старые продукты
  await prisma.product.deleteMany();

  const categories = ['electronics', 'books', 'clothing'];
  const products: Prisma.ProductCreateManyInput[] = [];

  for (let i = 0; i < 40; i++) {
    const category = categories[i % categories.length];
    products.push({
      title: `Product ${i + 1} (${category})`,
      description: `This is a description for product ${i + 1}`,
      price: Math.floor(Math.random() * 10000) + 100,
      category,
      inStock: true,
      images: [`https://via.placeholder.com/400?text=Product+${i + 1}`],
      specifications: {},
    });
  }

  await prisma.product.createMany({ data: products });
  console.log(`✅ Created ${products.length} products`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
