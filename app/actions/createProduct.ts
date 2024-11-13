'use server';

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import cloudinary, { UploadApiResponse } from 'cloudinary'; // Import UploadApiResponse type
import { Readable } from 'stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

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

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let uploadedImage: UploadApiResponse; // Explicitly type the uploadedImage
  try {
    uploadedImage = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: 'nextjs-products', public_id: uuidv4() },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse); // Explicitly cast result
        }
      );
      bufferToStream(buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image. Please try again later.');
  }

  try {
    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name: title,
      description,
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
        imageUrl: uploadedImage.secure_url, // Now TypeScript knows secure_url exists
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