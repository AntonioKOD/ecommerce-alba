'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {usePathname} from "next/navigation"
import { loadStripe } from "@stripe/stripe-js";

type Item = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: string;
  title: string;
  quantity: number;
  price: number;
  product: {price: number; title: string}
};

export default function NavBar() {
  const pathname = usePathname()
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [quantitiesToRemove, setQuantitiesToRemove] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    if (isCartOpen) {
      viewCart();
    }
  }, [isCartOpen]);

  

  async function viewCart() {
    try {
      const response = await fetch("/routes/cart-items");
      const data: Item[] = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }
  function getTotalPrice() {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }


 loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE!);

async function handleCheckout(cartItems: Item[]) {
  try {
    console.log("Cart items being sent:", cartItems); // Log here to inspect structure

    const response = await fetch("/routes/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems }), // Ensure no circular data here
    });

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    } else {
      console.error("Missing session URL.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
  }
}

  // Function to delete an item from the cart
  async function deleteFromCart(id: string, quantityToRemove: number) {
    try {
      const response = await fetch("/routes/cart-items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, quantityToRemove }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update or delete item from cart.");
      }

      const data = await response.json();
      viewCart()
      console.log("Item updated or deleted successfully:", data);

      // Update your cart items state
      setCartItems((prevItems) => 
        prevItems.filter((item) => item.id !== id || item.quantity > quantityToRemove)
      );
    } catch (error) {
      console.error("Error updating or deleting item from cart:", error);
    }
  }

  // Function to handle quantity input change
  function handleQuantityChange(id: string, value: number) {
    setQuantitiesToRemove((prev) => ({
      ...prev,
      [id]: value,
    }));
  }
  if(pathname.includes('/dashboard')){
    return <></>
  }

  return (
    <nav className="sticky top-0 border-b-4 px-4 py-2 bg-black text-white shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-amber-500 hover:text-white transition-colors duration-200">
          Alba
        </Link>

        {/* Links and Dropdown Menu */}
        <div className="hidden md:flex space-x-8 items-center text-lg">
          <Link href='/shop/all_products' className="text-lg">Shop</Link>
          <Link href="/" className="text-lg text-white hover:text-amber-500 transition-colors duration-200">
            Home
          </Link>
          <Link href="/recipes" className="text-lg text-white hover:text-amber-500 transition-colors duration-200">
            Recipes
          </Link>
          <Link href="/about" className="text-lg text-white hover:text-amber-500 transition-colors duration-200">
            About Us
          </Link>
        </div>

        {/* Cart and Authentication */}
        <div className="flex items-center space-x-4">
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
  <DialogTrigger asChild>
    <button className="text-2xl text-white hover:text-amber-500 transition-colors duration-200">
      <FiShoppingCart />
    </button>
  </DialogTrigger>
  <DialogContent className="w-[90%] max-w-md bg-black border border-amber-500 p-6 rounded-lg shadow-2xl">
    <h2 className="text-2xl font-bold text-amber-500 mb-4">Your Cart</h2>
    <div className="space-y-4 text-gray-300">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-gray-800 rounded-md shadow-md"
          >
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">{item.product.title}</p>
              <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-400">
                Price: ${item.product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={quantitiesToRemove[item.id] || 1}
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value))
                }
                className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Button
                onClick={() =>
                  deleteFromCart(item.id, quantitiesToRemove[item.id] || 1)
                }
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No items in your cart yet.</p>
      )}
    </div>
    <div className="mt-6 text-white font-semibold text-lg">
                Total: ${getTotalPrice().toFixed(2)}
              </div>
    <div className="mt-6 flex justify-end">
      <Button onClick={() => handleCheckout(cartItems)}className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition duration-200">
        Checkout
      </Button>
    </div>
  </DialogContent>
</Dialog>

          <div className="text-lg">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-2xl text-white">
                <FiMenu />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white border border-amber-500">
                <DropdownMenuItem className="hover:bg-amber-500  transition duration-200">
                  <Link href='/'>Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-amber-500 transition duration-200">
                  <Link href='/recipes'>Recipes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-amber-500 transition duration-200">
                  <Link href='/about'>About Us</Link>
                </DropdownMenuItem>
              <Link href='/shop/all_products'><DropdownMenuItem className="hover:bg-amber-500 transition duration-200">Shop</DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}