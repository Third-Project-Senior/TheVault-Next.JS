import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import OneProduct from './OneProduct.jsx';
import './AllProducts.css';

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all', 'electronic', 'clothing', 'books', 'furniture']);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/product/');
      setData(res.data);
      setError(null);
    } catch (error) {
      setError("Failed to load products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = data.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data.length) return <div className="no-products">No products available</div>;

  return (
    <div className="container">
      <h1 className="title-h1">All Products</h1>

      {/* Input Search */}
      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
        onKeyUp={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />

      <div className="category-navigation">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <br />
      <div className="products-grid">
        {filteredProducts.map((e, i) => (
          <OneProduct key={i} e={e} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
