import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

const host = process.env.NEXT_PUBLIC_HOST; // Use the new backend-specific variable

export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    const products = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItems.map((item) => item.id) },
      },
      include: {
        product: {
          select: {
            stripePriceId: true,
            title: true,
            price: true,
          },
        },
      },
    });

    const lineItems = products.map((item) => ({
      price: item.product.stripePriceId,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      cancel_url: `${host}/cancel`, // Ensure host is defined
      success_url: `${host}/success`, // Ensure host is defined
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }
}