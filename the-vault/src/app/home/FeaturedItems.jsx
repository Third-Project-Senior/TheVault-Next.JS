'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FeaturedItems = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product');
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.slice(0, 4).map((product) => (
        <div key={product.id} className="relative">
          {/* Stacked paper effect */}
          <div className="absolute inset-0 bg-white transform rotate-1 translate-x-1 translate-y-1"></div>
          <div className="absolute inset-0 bg-white transform -rotate-1 -translate-x-1 -translate-y-1"></div>
          
          {/* Main card */}
          <div className="relative bg-white p-4">
            <div 
              className="aspect-square overflow-hidden mb-6 cursor-pointer"
              onClick={() => router.push(`/products/details/${product.id}`)}
            >
              <img
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 
                className="font-serif text-base cursor-pointer"
                onClick={() => router.push(`/products/details/${product.id}`)}
              >
                {product.name}
              </h3>
              
              <div className="flex items-center justify-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-xs text-gray-300">★</span>
                  ))}
                </div>
              </div>

              <div className="text-xl font-serif">
                ${product.price?.toFixed(2)}
              </div>

              <button
                className="mt-4 w-full bg-white border border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white transition-all duration-200 py-2 px-4 text-sm font-serif"
                onClick={() => router.push(`/products/details/${product.id}`)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedItems;
