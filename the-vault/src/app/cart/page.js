'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');
   const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
  useEffect(() => {
    fetchCartItems(userId);
  }, []);

  const fetchCartItems = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${id}`);
      setCartItems(response.data);
      console.log(response.data, "cart items");
         
    } catch (err) {
      console.log(err)
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:3000/api/cart/${id}`, {
        quantity: newQuantity,
      });
      fetchCartItems(userId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${cartItemId}`);
      console.log(cartItemId , "id");
      
      fetchCartItems(userId);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.Product?.price * item.quantity,
      0
    );
  };

  const handleCheckout = async (id) => {
    const totalAmount = calculateTotal();
    const amountInMillimes = totalAmount * 1000;
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payment/payment",
        {
          amount: amountInMillimes,
        }
      );
  
      const paymentUrl = response.data.result.link;
      console.log(response.data.result.link);
      console.log("Payment URL:", paymentUrl);
      
      await axios.delete(`http://localhost:3000/api/cart/${id}`);

                  Swal.fire({
                    title: "Proceed to Checkout!",
                    icon: "success"
                    
                  });
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 500);
  
    } catch (error) {
      console.error("Payment Error:", error);
                 Swal.fire({
                    title: "Error!",
                    text: "Something went wrong during payment. Please try again.",
                    icon: "error",
                  });
    }
  };
  
     

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="continue-shopping-btn">Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-image">
                  <img
                    src={
                      item.Product?.image || "https://via.placeholder.com/150"
                    }
                    alt={item.Product?.name}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.Product?.name}</h3>
                  <p className="item-price">${item.Product?.price}</p>
                </div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  <p>${(item.Product?.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="remove-item">
                  <button
                    className="remove-btn"
                    onClick={() =>{
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                          });
                          handleRemoveItem(item.id)
                        }
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <button className="checkout-btn" onClick={()=> {
              Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Checkout!"
              }).then((result) => {
                if (result.isConfirmed) {
                 
                  handleCheckout(cartItems[0].id)
                }
              });
              

            }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
