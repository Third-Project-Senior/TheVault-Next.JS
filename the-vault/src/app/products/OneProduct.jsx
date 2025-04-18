import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const OneProduct = ({ e, isFeatured = false }) => {
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
    <div className={`group relative ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      {/* Background Frame */}
      <div className="absolute inset-0 border border-brown-200 transform -rotate-2 transition-transform duration-300 group-hover:rotate-0"></div>
      <div className="absolute inset-0 border border-brown-300 transform rotate-2 transition-transform duration-300 group-hover:rotate-0"></div>
      
      {/* Main Card */}
      <div className="relative bg-white border border-brown-100 transform transition-all duration-300 group-hover:translate-y-[-1px] group-hover:shadow-sm">
        {/* Product Image */}
        <div 
          className="relative overflow-hidden cursor-pointer"
          style={{ paddingTop: '75%' }}
          onClick={() => router.push(`/products/details/${e.id}`)}
        >
          <img 
            src={e.image || '/placeholder-product.jpg'} 
            className="absolute top-0 left-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            alt={e.name} 
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/details/${e.id}`);
            }}
            className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 text-brown-900 px-1.5 py-0.5 font-serif text-[10px] hover:bg-brown-900 hover:text-white"
          >
            Quick View
          </button>
        </div>

        {/* Product Info */}
        <div className="p-1.5 text-center bg-white relative">
          {isFeatured && (
            <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-brown-900 text-white px-1 py-0.5 text-[10px] font-serif">
              Featured
            </span>
          )}
          
          <h5 
            onClick={() => router.push(`/products/details/${e.id}`)} 
            className="text-[11px] font-serif mb-0.5 cursor-pointer hover:text-brown-700 transition-colors line-clamp-2"
            title={e.name}
          >
            {e.name}
          </h5>
          
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-0.5">
              <p className="text-xs font-serif text-brown-900">
                ${e.price?.toFixed(2)}
              </p>
              {e.oldPrice && (
                <p className="text-[10px] text-brown-400 line-through">
                  ${e.oldPrice?.toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-center mb-0.5">
              <div className="flex items-center text-brown-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-[10px]">
                    {i < Math.floor(e.rating || 0) ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-serif text-gray-900">${e.price}</span>
              <button 
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white transition-all duration-200 font-serif"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneProduct;