'use client';
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
      localStorage.setItem('cart', JSON.stringify(response.data));
     
      
    } catch (err) {
      console.log(err);
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

  const handleCheckout = async (userId) => {
    const totalAmount = calculateTotal();
    const amountInMillimes = totalAmount * 1000;
    

    try {
      const response = await axios.post(
        "http://localhost:3000/api/payment/payment",
        { amount: amountInMillimes }
      );

      const paymentUrl = response.data.result.link;

      await axios.delete(`http://localhost:3000/api/cart/clear/${userId}`);

      Swal.fire({
        title: "Proceed to Checkout!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end'
      });

      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 500);
    } catch (error) {
      console.error("Payment Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to initiate payment.",
        icon: "error",
        timer: 2000
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-100 rounded-md">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <a href="/shop" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-white">
                <img
                  src={item.Product?.image || "https://via.placeholder.com/150"}
                  alt={item.Product?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.Product?.name}</h3>
                  <p className="text-gray-500">${item.Product?.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="w-12 text-center border rounded"
                  />
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right">
                  <p className="text-gray-800 font-semibold">
                    ${(item.Product?.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => {
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
                        Swal.fire("Deleted!", "Item has been removed.", "success");
                        handleRemoveItem(item.id);
                      }
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <h3 className="text-xl font-bold mb-4">
              Total: <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
            </h3>
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              onClick={() => {
                Swal.fire({
                  title: "Confirm Checkout?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Checkout!"
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleCheckout(userId);
                  }
                });
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
