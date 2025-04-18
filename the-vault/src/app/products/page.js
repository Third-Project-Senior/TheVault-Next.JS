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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const searchParams = useSearchParams();

  useEffect(() => {
    getData();
    getCategories();
    
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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
      <div className="w-16 h-16 border-4 border-brown-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-serif">
        {error}
      </div>
    </div>
  );
  
  if (!data.length) return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
      <div className="bg-brown-50 border border-brown-200 text-brown-700 px-6 py-4 rounded-lg font-serif">
        No products available
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/247929/pexels-photo-247929.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Antique Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-serif mb-4">
              {selectedCategory === 'all' ? 'Our Collection' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`}
            </h1>
            <p className="text-xl font-serif max-w-2xl mx-auto">
              Discover our carefully curated collection of timeless pieces, each with its own unique story and character.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Input */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search our collection..."
            className="w-full max-w-md px-6 py-3 border-2 border-brown-200 rounded-none bg-transparent text-brown-900 placeholder-brown-400 focus:outline-none focus:border-brown-600 transition-all duration-200 font-serif"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            key="all"
            className={`px-6 py-2 font-serif transition-all duration-200 border-2 ${
              selectedCategory === 'all'
                ? 'border-black bg-black text-white' 
                : 'border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All Items
          </button>
          {categories.filter(cat => cat !== 'all').map((category) => (
            <button
              key={category.id || category}
              className={`px-6 py-2 font-serif transition-all duration-200 border-2 ${
                category.name && category.name.toLowerCase() === selectedCategory.toLowerCase()
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white'
              }`}
              onClick={() => setSelectedCategory(category.name.toLowerCase())}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((product, index) => (
            <OneProduct key={index} e={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brown-600 text-lg font-serif">No items match your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 border-2 border-brown-300 text-brown-700 font-serif disabled:opacity-50 disabled:cursor-not-allowed hover:border-brown-900 transition-all duration-200"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 font-serif ${
                  currentPage === i + 1 
                    ? 'border-2 border-brown-900 bg-brown-900 text-white' 
                    : 'border-2 border-brown-300 text-brown-700 hover:border-brown-900'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 border-2 border-brown-300 text-brown-700 font-serif disabled:opacity-50 disabled:cursor-not-allowed hover:border-brown-900 transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;