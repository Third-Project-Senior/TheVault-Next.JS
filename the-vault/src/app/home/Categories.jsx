'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/category/getAll');
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setError('Invalid categories data received');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse flex-shrink-0 w-[280px]">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        No categories available
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <Link 
            href={`/shop/${category.name.toLowerCase()}`} 
            key={category.id}
            className="flex-shrink-0 w-[280px]"
          >
            <div className="group relative">
              {/* Background Frame */}
              <div className="absolute inset-0 border border-gray-200 transform -rotate-2 transition-transform duration-300 group-hover:rotate-0"></div>
              <div className="absolute inset-0 border border-gray-300 transform rotate-2 transition-transform duration-300 group-hover:rotate-0"></div>
              
              {/* Main Card */}
              <div className="relative bg-white border border-gray-100 transform transition-all duration-300 group-hover:translate-y-[-1px] group-hover:shadow-sm">
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image || '/placeholder-product.jpg'}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Category Info */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-serif mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">Discover our collection</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors -ml-4 hidden md:block"
        onClick={() => {
          const container = document.querySelector('.overflow-x-auto');
          container.scrollBy({ left: -300, behavior: 'smooth' });
        }}
      >
        ←
      </button>
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors -mr-4 hidden md:block"
        onClick={() => {
          const container = document.querySelector('.overflow-x-auto');
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }}
      >
        →
      </button>
    </div>
  );
};

export default Categories; 