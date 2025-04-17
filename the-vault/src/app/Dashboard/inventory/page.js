"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts';

const CategoryProductCount = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define chart colors
  const chartColors = [
    '#2196f3', // Blue
    '#00bcd4', // Cyan
    '#4caf50', // Green
    '#ff9800', // Orange
    '#f44336', // Red
    '#9c27b0', // Purple
    '#795548', // Brown
    '#607d8b', // Blue Grey
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch('http://localhost:3000/api/product'),
          fetch('http://localhost:3000/api/category/getAll'),
        ]);

        const productsData = await productRes.json();
        const categoriesData = await categoryRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductCountForCategory = (categoryId) => {
    return products.filter((product) => product.categoryId === categoryId).length;
  };

  // Prepare data for PieChart with colors
  const pieChartData = categories.map((category, index) => ({
    id: index,
    value: getProductCountForCategory(category.id),
    label: category.name,
    color: chartColors[index % chartColors.length],
  }));

  if (loading) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Product Count by Category</h2>

      {/* Pie Chart Container with Flex Layout */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Chart Section */}
        <div className="w-full md:w-1/2">
          <PieChart
            series={[
              {
                data: pieChartData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30 },
              }
            ]}
            slotProps={{
              legend: {
                hidden: true, // Hide default legend
              },
            }}
            width={500}
            height={400}
          />
        </div>

        {/* Legend Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="grid grid-cols-1 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-gray-600">{getProductCountForCategory(category.id)} products</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductCount; 