'use client';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import OneProduct from './OneProduct.jsx';
import { useSearchParams } from 'next/navigation';

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    getData();
    getCategories();
    
    // Get category from URL parameter
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const getCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/category/getAll');
      setCategories(['all', ...res.data]);
    } catch (error) {
      console.error("Failed to load categories: ", error);
    }
  }

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/product');
      setData(res.data);
      setError(null);
    } catch (error) {
      setError("Failed to load products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = data.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      (product.categoryId && categories.find(cat => 
        cat.name && cat.name.toLowerCase() === selectedCategory.toLowerCase())?.id === product.categoryId);
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );
  
  if (!data.length) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        No products available
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {selectedCategory === 'all' ? 'All Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
      </h1>

      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id || category}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
              (category === 'all' && selectedCategory === 'all') || 
              (category.name && category.name.toLowerCase() === selectedCategory.toLowerCase())
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category === 'all' ? 'all' : category.name.toLowerCase())}
          >
            {category === 'all' ? 'All' : category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <OneProduct key={index} e={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default AllProducts;