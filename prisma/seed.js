// prisma/seed.js

import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        id: '1',
        title: 'Wireless Bluetooth Headphones',
        description: 'High-quality over-ear headphones with noise cancellation and long battery life.',
        price: 99.99,
        stock: 50,
        imageUrl: 'https://example.com/images/headphones.jpg',
      },
      {
        id: '2',
        title: 'Stainless Steel Water Bottle',
        description: 'Durable, reusable water bottle with double-wall insulation to keep drinks cold or hot.',
        price: 24.99,
        stock: 100,
        imageUrl: 'https://example.com/images/water-bottle.jpg',
      },
      {
        id: '3',
        title: 'Ergonomic Office Chair',
        description: 'Comfortable office chair with adjustable height, lumbar support, and breathable mesh back.',
        price: 199.99,
        stock: 20,
        imageUrl: 'https://example.com/images/office-chair.jpg',
      },
      {
        id: '4',
        title: 'Portable Power Bank',
        description: 'Fast-charging power bank with 10,000mAh capacity, perfect for on-the-go charging.',
        price: 29.99,
        stock: 75,
        imageUrl: 'https://example.com/images/power-bank.jpg',
      },
      {
        id: '5',
        title: 'Smart LED Light Bulbs',
        description: 'Pack of 4 smart LED bulbs compatible with voice assistants and smartphone apps.',
        price: 39.99,
        stock: 60,
        imageUrl: 'https://example.com/images/smart-bulbs.jpg',
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });