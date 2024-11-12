'use server';

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createProduct(formData: FormData) {
  const title = formData.get('title');
  const description = formData.get('description');
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const image = formData.get('image');

  // Validate form data
  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    isNaN(price) ||
    isNaN(stock) ||
    !(image instanceof File)
  ) {
    throw new Error('Invalid form data. Please check all fields.');
  }

  // Generate a unique filename for the image
  const imageName = `${uuidv4()}-${image.name}`;
  path.join('/tmp', imageName);

  // Ensure the uploads directory exists
  //await fs.mkdir(path.dirname(imagePath), { recursive: true });

  // Save the image to the uploads directory
  //const arrayBuffer = await image.arrayBuffer();
  //await fs.writeFile(imagePath, Buffer.from(arrayBuffer));

  try {
    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name: title,
      description: description,
    });

    // Create price in Stripe
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: 'usd',
      product: stripeProduct.id,
    });

    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        stock,
        imageUrl: `/routes/images?name=${imageName}`,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      },
    });

    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product. Please try again later.');
  }
}