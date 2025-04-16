import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const OneProduct = ({ e }) => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!e) {
    console.error("OneProduct received no data");
    return null;
  }

  const handleAddToCart = async () => {
    if (!token) {
      Swal.fire({
        title: "Login Required!",
        text: "Please login to add items to cart",
        icon: "warning",
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
      router.push('/Login');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/cart', {
        productId: e.id,
        quantity: 1,
        userId: jwtDecode(token).id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      Swal.fire({
        title: "Success!",
        text: "Product added to cart.",
        icon: "success",
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add product to cart",
        icon: "error",
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div 
        className="relative pt-[100%] cursor-pointer" 
        onClick={() => router.push(`/products/details/${e.id}`)}
      >
        <img 
          src={e.image || '/placeholder-product.jpg'} 
          className="absolute top-0 left-0 w-full h-full object-cover"
          alt={e.name} 
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h5 
          onClick={() => router.push(`/products/details/${e.id}`)} 
          className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
          title={e.name}
        >
          {e.name}
        </h5>
        
        <div className="mt-auto">
          <p className="text-gray-800 font-medium mb-1">
            <span className="text-gray-600">Price:</span> ${e.price?.toFixed(2)}
          </p>
          
          <div className="flex items-center mb-3">
            <span className="text-gray-600 mr-1">Rating:</span>
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.floor(e.rating || 0) ? '★' : '☆'}</span>
              ))}
              {/* <span className="text-gray-600 text-sm ml-1">({e.rating?.toFixed(1)})</span> */}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneProduct;