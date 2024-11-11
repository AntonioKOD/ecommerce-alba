'use client'
import React from "react"
import {useState, useEffect} from 'react'

type Product = {
    id: number; // or string, depending on your schema
    title: string;
    description: string;
    stripePriceId: string;
};

export default function Dashboard(){
    const [products, setProducts] = useState<Product[]>([]);
    useEffect( ()=> { 
        const getProducts = async()=> {
        const res = await fetch('/routes/getProducts');
        const data = await res.json();
        setProducts(data)
    }
    getProducts();
}, [])

const handleDelete = async (productId: string) => {
    try {
        const response = await fetch('/routes/deleteProduct', {  // Ensure correct API path
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: productId }), // productId is already string
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Product deleted:', result);

            // Update state by filtering out the deleted product
            setProducts((prevProducts) =>
                prevProducts.filter((item) => String(item.id) !== productId)
            );
        } else {
            // Handle empty response body on error
            const errorText = await response.text(); // Use .text() to avoid JSON parse errors
            console.error('Failed to delete product:', errorText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};
    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Products</h1>
            <ul className="space-y-4">
                {products.map((product) => (
                    <li
                        key={product.id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-2xl font-semibold text-blue-600 mb-2">{product.title}</h2>
                            <p className="text-gray-700 mb-2">{product.description}</p>
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">Price ID:</span> {product.stripePriceId}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(String(product.id))}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}