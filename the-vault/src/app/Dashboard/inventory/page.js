// 'use client'
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const Inventory = () => {
//   const [products, setProducts] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);

//   useEffect(() => {
//     axios
//       .get('http://localhost:3000/api/product')
//       .then((response) => setProducts(response.data))
//       .catch((error) => console.error('Error fetching products', error));

//     axios
//       .get('http://localhost:4000/api/subcategories')
//       .then((response) => setSubcategories(response.data))
//       .catch((error) => console.error('Error fetching subcategories', error));
//   }, []);

//   const productsBySubcategory = subcategories.map((subcategory) => {
//     const filteredProducts = products.filter(
//       (product) => product.SubCategoryId === subcategory.id
//     );
//     return {
//       subcategory,
//       productCount: filteredProducts.length,
//       sampleProduct: filteredProducts[0],
//     };
//   });

//   // Function to shuffle the array
//   const shuffleArray = (array) => {
//     const shuffledArray = [...array];
//     for (let i = shuffledArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//     }
//     return shuffledArray;
//   };

//   // Shuffle the productsBySubcategory array
//   const shuffledProducts = shuffleArray(productsBySubcategory);

//   const chartData = shuffledProducts.map((group) => ({
//     name: group.subcategory.name,
//     productCount: group.productCount,
//   }));

//   return (
//     <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg shadow-md">
//       <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
//         Inventory Overview
//       </h2>

//       {/* Bar Chart */}
//       <div className="mb-8">
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="productCount" fill="#3b82f6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Subcategory Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {shuffledProducts.map((group) => {
//           const imageUrl =
//             group.sampleProduct?.image || 'https://via.placeholder.com/300x200?text=No+Image';

//           return (
//             <div
//               key={group.subcategory.id}
//               className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform hover:scale-105 max-w-lg mx-auto"
//             >
//               <img
//                 src={imageUrl}
//                 alt={group.subcategory.name}
//                 className="h-56 w-full object-cover"
//               />
//               <div className="p-5">
//                 <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
//                   {group.subcategory.name}
//                 </h3>
//                 <p className="text-base text-gray-600 dark:text-gray-300">
//                   {`Products: ${group.productCount}`}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Inventory;
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts';

const CategoryProductCount = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Prepare data for PieChart
  const pieChartData = categories.map((category, index) => ({
    id: index,
    value: getProductCountForCategory(category.id),
    label: category.name,
  }));

  if (loading) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Product Count by Category</h2>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <PieChart
          series={[{ data: pieChartData }]}
          width={400}
          height={300}
        />
      </div>

      {/* Category Cards */}
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white shadow-md border border-gray-200 rounded-lg p-6 w-64"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {category.name}
            </h3>
            <p className="text-gray-600">
              {getProductCountForCategory(category.id)} products
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductCount;



