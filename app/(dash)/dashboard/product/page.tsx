'use client'
import React, { useState } from 'react';
import { createProduct } from '@/app/actions/createProduct';

export default function AddProduct() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createProduct(formData);
      setError(null); // Clear any previous errors on success
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md ml-12"
    >
      <label className="block mb-4">
        <span className="text-gray-700 font-semibold">Title</span>
        <input
          type="text"
          name="title"
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700 font-semibold">Description</span>
        <textarea
          name="description"
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></textarea>
      </label>
      <label className="block mb-4">
        <span className="text-gray-700 font-semibold">Price</span>
        <input
          type="number"
          name="price"
          step="0.01"
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700 font-semibold">Stock</span>
        <input
          type="number"
          name="stock"
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </label>
      <label className="block mb-6">
        <span className="text-gray-700 font-semibold">Image</span>
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="mt-1 block w-full text-gray-700"
        />
      </label>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Create Product
      </button>
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </form>
  );
}