import React from 'react';
import { useNavigate } from 'react-router-dom';

import './OneProduct.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const OneProduct = ({ e }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log("OneProduct received data:", e);

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
          onClick={() => navigate(`/product/${e.id}`)} 
          className="product-title1"
        >
          {e.name}
        </h5>
        <p className="product-price"><strong>Price:</strong> ${e.price}</p>
        <p className="product-rating"><strong>Rating:</strong> {e.rating} ⭐</p>
        <button onClick={async()=>{
          try {
            await axios.post('http://localhost:3000/api/cart', {
              productId: e.id,
              quantity: 1,
              userId: jwtDecode(token).id,
            },{
              headers: {
                'Authorization': `Bearer ${token}`

                
              }

            })
            console.log("Product added to cart successfully")
            navigate('/cart');
          } catch (error) {
            console.log("Error adding to cart:", error);

            
          }
        }} className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default OneProduct;
