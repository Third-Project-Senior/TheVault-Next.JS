import React from 'react';
import Swal from 'sweetalert2'

import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation'

const OneProduct = ({ e }) => {
  const router = useRouter()
  const token = localStorage.getItem('token');
  // console.log("OneProduct received data:", e);

  if (!e) {
    console.error("OneProduct received no data");
    return null;
  }

  return (
    <div className="product-card">
      <div className="product-image1-container">
        <img 
          src={e.image} 
          className="product-image1" 
          alt={e.name} 
        />
      </div>
      <div className="product-info">
        <h5 
          onClick={() => router.push(`/products/details/${e.id}`)} 
          className="product-title1"
        >
          {e.name}
        </h5>
        <p className="product-price"><strong>Price:</strong> ${e.price}</p>
        <p className="product-rating"><strong>Rating:</strong> {e.rating} ⭐</p>
        <button onClick={async()=>{
          try {
            // const response = await axios.get(`http://localhost:3000/api/cart/${jwtDecode(token).id}`);
            
            
            await axios.post('http://localhost:3000/api/cart', {
              productId: e.id,
              quantity: 1,
              userId: jwtDecode(token).id,
            },{
              headers: {
                'Authorization': `Bearer ${token}`

                
              }

            })
            Swal.fire({
              title: "Success!",
              text: "Product added to cart.",
              icon: "success",
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
            });
          } catch (error) {
            console.log("Error adding to cart:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to add product to cart.",
              icon: "error",
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }} className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default OneProduct;
