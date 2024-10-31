import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: { product: true }, // Include related product details if needed
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.log("No items in the cart", error);
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
    try {
      // Parse the request body to get the item ID and quantity to remove
      const { id, quantityToRemove } = await req.json();
  
      if (!id || !quantityToRemove || quantityToRemove <= 0) {
        return NextResponse.json({ error: "Valid ID and quantity are required" }, { status: 400 });
      }
  
      // Fetch the current cart item
      const cartItem = await prisma.cartItem.findUnique({
        where: { id },
      });
  
      if (!cartItem) {
        return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
      }
  
      // Check if the quantity to remove is less than the current quantity
      if (cartItem.quantity > quantityToRemove) {
        // Update the cart item with the reduced quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id },
          data: { quantity: cartItem.quantity - quantityToRemove },
        });
        return NextResponse.json(updatedItem, { status: 200 });
      } else {
        // If the quantity to remove is greater than or equal to the current quantity, delete the item
        await prisma.cartItem.delete({
          where: { id },
        });
        return NextResponse.json({ message: "Item deleted from cart" }, { status: 200 });
      }
    } catch (error) {
      console.log("Error updating or deleting cart item:", error);
      return NextResponse.json({ error: "Failed to update or delete item from cart" }, { status: 500 });
    }
  }