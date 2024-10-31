import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const {userId} = getAuth(req);
  try {
    // Parse the request body
    const { productId, quantity } = await req.json(); // Get the authenticated user ID from Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the cart item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        clerkId: userId,
        productId,
      },
    });

    if (existingItem) {
      // Update the quantity if the item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Create a new cart item if it doesn't exist
      await prisma.cartItem.create({
        data: {
          clerkId: userId,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json({ error: "Failed to add product to cart" }, { status: 500 });
  }
}