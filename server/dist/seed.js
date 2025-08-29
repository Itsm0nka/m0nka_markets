import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
const categories = ['electronics', 'clothing', 'home', 'sports', 'books', 'beauty'];
const productTitles = {
    electronics: [
        'iPhone 15 Pro Max 256GB',
        'Samsung Galaxy S24 Ultra',
        'MacBook Air M2 13-inch',
        'Dell XPS 13 Laptop',
        'iPad Pro 12.9-inch',
        'AirPods Pro (3rd gen)',
        'Sony WH-1000XM5 Headphones',
        'LG 55" OLED TV',
        'Apple Watch Series 9',
        'Gaming Mechanical Keyboard'
    ],
    clothing: [
        'Premium Cotton T-Shirt',
        'Leather Jacket - Black',
        'Denim Jeans - Slim Fit',
        'Wool Sweater - Navy',
        'Summer Dress - Floral',
        'Running Shoes - Air Max',
        'Formal Blazer - Charcoal',
        'Casual Sneakers - White',
        'Winter Coat - Down Filled',
        'Silk Scarf - Designer'
    ],
    home: [
        'Modern Dining Table Set',
        'Ergonomic Office Chair',
        'Memory Foam Mattress Queen',
        'LED Floor Lamp',
        'Coffee Maker - Premium',
        'Non-Stick Cookware Set',
        'Vacuum Cleaner - Robotic',
        'Air Purifier - HEPA',
        'Throw Pillows Set of 4',
        'Wall Art - Abstract'
    ],
    sports: [
        'Yoga Mat - Extra Thick',
        'Dumbbells Set - Adjustable',
        'Tennis Racket - Professional',
        'Basketball - Official Size',
        'Hiking Backpack - 40L',
        'Swimming Goggles - Anti-Fog',
        'Bicycle Helmet - Lightweight',
        'Fitness Tracker - Waterproof',
        'Protein Powder - Chocolate',
        'Resistance Bands Set'
    ],
    books: [
        'The Psychology of Money',
        'Atomic Habits - James Clear',
        'Sapiens - Yuval Noah Harari',
        'The 7 Habits of Highly Effective People',
        'Educated - Tara Westover',
        'Becoming - Michelle Obama',
        'The Midnight Library',
        'Where the Crawdads Sing',
        'The Silent Patient',
        'Project Hail Mary'
    ],
    beauty: [
        'Vitamin C Serum - 20%',
        'Hyaluronic Acid Moisturizer',
        'Retinol Night Cream',
        'Sunscreen SPF 50+',
        'Clay Face Mask',
        'Rose Gold Hair Dryer',
        'Makeup Brush Set - 12pcs',
        'Liquid Foundation - Full Coverage',
        'Eyeshadow Palette - Neutral',
        'Lip Balm Set - Organic'
    ]
};
const getRandomImage = (category, index) => {
    const baseImages = {
        electronics: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=400&fit=crop&crop=center`,
        clothing: `https://images.unsplash.com/photo-${1500001000000 + index}?w=400&h=400&fit=crop&crop=center`,
        home: `https://images.unsplash.com/photo-${1500002000000 + index}?w=400&h=400&fit=crop&crop=center`,
        sports: `https://images.unsplash.com/photo-${1500003000000 + index}?w=400&h=400&fit=crop&crop=center`,
        books: `https://images.unsplash.com/photo-${1500004000000 + index}?w=400&h=400&fit=crop&crop=center`,
        beauty: `https://images.unsplash.com/photo-${1500005000000 + index}?w=400&h=400&fit=crop&crop=center`,
    };
    return [
        baseImages[category],
        baseImages[category].replace('?w=400&h=400', '?w=800&h=600'),
        baseImages[category].replace('?w=400&h=400', '?w=600&h=400'),
    ];
};
const getRandomSpecs = (category) => {
    const specs = {
        electronics: {
            Brand: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell'][Math.floor(Math.random() * 5)],
            Warranty: '1 Year',
            Color: ['Black', 'White', 'Silver', 'Blue'][Math.floor(Math.random() * 4)],
        },
        clothing: {
            Material: ['Cotton', 'Polyester', 'Wool', 'Silk'][Math.floor(Math.random() * 4)],
            Size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
            Color: ['Black', 'White', 'Navy', 'Gray'][Math.floor(Math.random() * 4)],
        },
        home: {
            Material: ['Wood', 'Metal', 'Plastic', 'Glass'][Math.floor(Math.random() * 4)],
            Dimensions: '50x30x20cm',
            Weight: '5kg',
        },
        sports: {
            Brand: ['Nike', 'Adidas', 'Puma', 'Under Armour'][Math.floor(Math.random() * 4)],
            Material: ['Synthetic', 'Leather', 'Mesh', 'Cotton'][Math.floor(Math.random() * 4)],
            Size: ['One Size', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
        },
        books: {
            Author: 'Various Authors',
            Pages: Math.floor(Math.random() * 400) + 200,
            Language: 'English',
            Publisher: ['Penguin', 'Random House', 'Harper'][Math.floor(Math.random() * 3)],
        },
        beauty: {
            Brand: ['Ordinary', 'CeraVe', 'Neutrogena', 'L\'Oreal'][Math.floor(Math.random() * 4)],
            'Skin Type': ['All Skin Types', 'Dry Skin', 'Oily Skin'][Math.floor(Math.random() * 3)],
            Volume: '50ml',
        },
    };
    return specs[category] || {};
};
async function main() {
    console.log('🌱 Starting database seed...');
    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@marketplace.com' },
        update: {},
        create: {
            name: 'Demo User',
            email: 'demo@marketplace.com',
            password: hashedPassword,
        },
    });
    console.log(`👤 Created demo user: ${demoUser.email}`);
    // Delete existing products
    await prisma.product.deleteMany();
    // Create 40 products (10 rows × 4 columns as requested)
    const products = [];
    let productIndex = 0;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 4; col++) {
            const category = categories[productIndex % categories.length];
            const categoryProducts = productTitles[category];
            const title = categoryProducts[productIndex % categoryProducts.length];
            const basePrice = Math.floor(Math.random() * 2000000) + 100000; // 100k to 2.1M sum
            const hasDiscount = Math.random() > 0.6; // 40% chance of discount
            const discountPrice = hasDiscount ? Math.floor(basePrice * 0.8) : null;
            const product = {
                title: `${title} #${productIndex + 1}`,
                description: `High-quality ${category} item with excellent features and great value for money. Perfect for everyday use with premium materials and modern design.`,
                price: basePrice,
                discountPrice,
                images: getRandomImage(category, productIndex),
                category,
                rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
                reviewCount: Math.floor(Math.random() * 500) + 10, // 10 to 510 reviews
                inStock: Math.random() > 0.1, // 90% in stock
                specifications: getRandomSpecs(category),
                installmentMonths: hasDiscount && Math.random() > 0.5 ? [6, 12, 24][Math.floor(Math.random() * 3)] : null,
            };
            products.push(product);
            productIndex++;
        }
    }
    // Insert products in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        await prisma.product.createMany({
            data: batch,
        });
        console.log(`📦 Created products ${i + 1}-${Math.min(i + batchSize, products.length)}`);
    }
    console.log(`✅ Seed completed! Created ${products.length} products`);
    console.log('🔐 Demo credentials: demo@marketplace.com / demo123');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
