'use client';
import React, { useState, useEffect } from 'react';

const FeaturedItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product');
        console.log(response.data);
        
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        setProducts(data); // Show all products
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
      <section className="featured-items py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold mb-6">Featured Products</h2>
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-items py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold mb-6">Featured Products</h2>
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-items py-10 bg-gray-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="product-image-container">
                <img
                  src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-70 object-cover"
                />
              </div>
              <div className="p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4">${product.price}</p>
                <a
                  href={`/products/details/${product.id}`}
                  className="mt-auto bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
