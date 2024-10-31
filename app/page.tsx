"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Featured from "./components/Featured";




export default function Home() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
        <h1 className="text-6xl font-extrabold text-gray-300 tracking-wide leading-tight md:text-7xl lg:text-8xl">
          Bring the Essence of Alba Home
        </h1>
        <p className="text-gray-400 text-2xl tracking-wide leading-tight">
          Shop Exclusive Merchandise
        </p>
        <Button className="bg-red-700 px-6 py-3 text-lg font-semibold rounded-lg hover:bg-red-800 transition duration-200">
          <Link href="/">Shop Now</Link>
        </Button>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Featured />
      </div>
    </div>
  );
}