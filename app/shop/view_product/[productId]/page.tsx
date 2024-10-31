'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = useParams(); // Use useParams to get the productId

  useEffect(() => {
    if (!productId) return; // Wait until productId is available

    async function fetchProductDetails() {
      try {
        // Make a POST request to your backend route to fetch product details
        const response = await fetch("/shop/view_product/single_product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
      <Image src={product.imageUrl} alt={product.title} className="w-full h-64 object-cover mb-4" />
      <p className="text-lg mb-4">{product.description}</p>
      <p className="text-2xl font-bold text-red-500">${product.price.toFixed(2)}</p>
    </div>
  );
}