"use client"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


import {useUser} from '@clerk/nextjs'
import { useState, useEffect } from "react";

type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
  imageUrl: string
}







export default function Featured() {
  const {user} = useUser()
  const clerkId = user?.id
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(()=> {
    async function fetchProducts(){
      try{
        const response = await fetch('/shop/all_products/get_products')
        const data: Product[] = await response.json()
        setProducts(data)
      }catch(error){
        console.log('Error fetching data', error)
      }
    }
    fetchProducts();
  }, [])
  async function addToCart(productId: string, quantity=1){
    if(!clerkId){
      console.error('User is not authenticated')
      return;
    }

    try{
      const response = await fetch("/routes/add-to-cart", {
        method: 'POST',
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({clerkId, productId, quantity})
      })
      if(response.ok){
       await response.json();
        console.log("Product added to cart")
      }
    }catch(error){
      console.error("Error adding product", error)
    }
  }
  return (
    <div className="text-center text-gray-200">
      <h2 className="text-4xl font-bold mb-8 text-amber-500">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <Card key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardContent>
              <h3 className="text-xl font-semibold text-amber-500 mb-2">{product.title}</h3>
              <CardDescription className="text-gray-400 mb-4">
                {product.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-bold text-red-500">{product.price}</span>
              <Button  onClick={()=> addToCart(product.id)}className="bg-amber-500 text-black px-4 py-2 rounded-md hover:bg-amber-600 transition duration-200">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}