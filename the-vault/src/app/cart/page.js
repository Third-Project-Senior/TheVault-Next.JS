'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "You are not logged in.",
        icon: "error",
        timer: 2000,
      });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    } catch (error) {
      console.error("Invalid token:", error);
      Swal.fire({
        title: "Error!",
        text: "Invalid token. Please log in again.",
        icon: "error",
        timer: 2000,
      });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
    }
  }, [userId]);

  const fetchCartItems = async (id) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/cart/${id}`;
      console.log("Fetching cart items from:", url);

      const response = await axios.get(url);
      setCartItems(response.data);
      localStorage.setItem("cart", JSON.stringify(response.data));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.error("Cart not found for user ID:", id);
        Swal.fire({
          title: "Error!",
          text: "Cart not found.",
          icon: "error",
          timer: 2000,
        });
      } else {
        console.error("Error fetching cart items:", err);
      }
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      await axios.put(`${baseUrl}/api/cart/${id}`, { quantity: newQuantity });
      fetchCartItems(userId);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      await axios.delete(`${baseUrl}/api/cart/${cartItemId}`);
      fetchCartItems(userId);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (Number(item.Product?.price) || 0) * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    const totalAmount = calculateTotal();
    const amountInMillimes = totalAmount * 1000;
    

    try {
      // Store cart items in localStorage for order creation after payment
      localStorage.setItem('pendingOrderItems', JSON.stringify(cartItems));
      localStorage.setItem('pendingOrderAmount', totalAmount.toString());
      
      // Step 1: Initiate payment
      const response = await axios.post(`http://localhost:3000/api/payment/payment`, {
        amount: amountInMillimes,
        cartItems
      });

      const paymentUrl = response.data.result?.link;
      if (!paymentUrl) {
        throw new Error("Payment URL not returned from the API.");
      }

      // Step 2: Clear the cart
      await axios.delete(`http://localhost:3000/api/cart/clear/${userId}`);

      // Step 3: Notify the user and redirect
      Swal.fire({
        title: "Proceed to Checkout!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
      });

      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 500);
    } catch (error) {
      console.error("Checkout Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to initiate checkout. Please try again.",
        icon: "error",
        timer: 2000,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-100 rounded-md">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <a
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-white"
              >
                <img
                  src={item.Product?.image || "https://via.placeholder.com/150"}
                  alt={item.Product?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {item.Product?.name}
                  </h3>
                  <p className="text-gray-500">
                    ${(Number(item.Product?.price) || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
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
                    className="w-12 text-center border rounded"
                    aria-label="Quantity"
                  />
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right">
                  <p className="text-gray-800 font-semibold">
                    ${(
                      (Number(item.Product?.price) || 0) * item.quantity
                    ).toFixed(2)}
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
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire(
                          "Deleted!",
                          "Item has been removed.",
                          "success"
                        );
                        handleRemoveItem(item.id);
                      }
                    });
                  }}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <h3 className="text-xl font-bold mb-4">
              Total:{" "}
              <span className="text-green-600">
                ${calculateTotal().toFixed(2)}
              </span>
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
                  confirmButtonText: "Checkout!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleCheckout();
                  }
                });
              }}
              aria-label="Proceed to checkout"
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