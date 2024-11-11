'use server';

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import Stripe from 'stripe'

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createProduct(formData: FormData) {
  const title = formData.get('title');
  const description = formData.get('description');
  const price = parseFloat(formData.get('price'));
  const stock = parseInt(formData.get('stock'), 10);
  const image = formData.get('image');

  // Validate form data
  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    isNaN(price) ||
    isNaN(stock) ||
    !(image instanceof File)
  ) {
    throw new Error('Invalid form data');
  }

  // Generate a unique filename
  const imageName = `${uuidv4()}-${image.name}`;
  const imagePath = path.join(process.cwd(), 'public', 'uploads', imageName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(imagePath), { recursive: true });

  // Save the image to the uploads directory
  const arrayBuffer = await image.arrayBuffer();
  await fs.writeFile(imagePath, Buffer.from(arrayBuffer));

  const stripeProduct = await stripe.products.create({
    name: title,
    description: description,
  })

  const stripePrice = await stripe.prices.create({
    unit_amount: price * 100,
    currency: 'usd',
    product: stripeProduct.id
  })
  // Create the product in the database
  const product = await prisma.product.create({
    data: {
      title,
      description,
      price,
      stock,
      imageUrl: `/uploads/${imageName}`,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id
    },
  });

  return product;
}

