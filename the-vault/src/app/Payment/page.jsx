'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const Success = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Handle the success notification and redirect
  useEffect(() => {
    if (paymentStatus === 'Payment Successful!') {
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Thank you for your purchase. Your payment has been processed successfully.',
        icon: 'success',
        confirmButtonText: 'Awesome!',
        confirmButtonColor: '#4CAF50',
        timer: 3000,
        timerProgressBar: true,
      });

      const timer = setTimeout(() => router.push('/'), 2500);
      return () => clearTimeout(timer); // Cleanup
    }
  }, [paymentStatus, router]);

  // Verify the payment
  useEffect(() => {
    const paymentId = new URLSearchParams(window.location.search).get('payment_id');

    if (!paymentId) {
      router.push('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/payment/verify/${paymentId}`);
        
        if (response.data.status === "success") {
          // Create order after successful payment
          await createOrder();
          setPaymentStatus('Payment Successful!');
        } else {
          setPaymentStatus('Payment verification failed');
        }
      } catch (error) {
        console.error('Verification failed', error);
        setPaymentStatus('Error verifying payment');
      }
    };

    verifyPayment();
  }, [router]);

  // Create order from the stored cart items
  const createOrder = async () => {
    try {
      // Get stored cart items and total amount
      const pendingOrderItems = JSON.parse(localStorage.getItem('pendingOrderItems') || '[]');
      const totalAmount = parseFloat(localStorage.getItem('pendingOrderAmount') || '0');
      
      if (!pendingOrderItems.length) {
        console.error('No order items found in localStorage');
        return;
      }

      // Get user ID from token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      // Debug the order items
      console.log('Original pending items:', pendingOrderItems);

      // Format items for order creation - ensure proper structure
      const formattedItems = [];
      
      for (const item of pendingOrderItems) {
        // Extract product ID and price safely
        let productId, price, quantity;
        
        if (item.Product && typeof item.Product === 'object') {
          // If item has a Product object
          productId = item.Product.id;
          price = parseFloat(item.Product.price);
        } else if (item.productId) {
          // If item has a direct productId
          productId = item.productId;
          price = parseFloat(item.price);
        }
        
        quantity = parseInt(item.quantity);
        
        if (productId && !isNaN(price) && !isNaN(quantity) && quantity > 0) {
          formattedItems.push({
            productId,
            quantity,
            price,
            paymentMethod:"credit_card"
          });
        } else {
          console.error('Invalid item data:', item);
        }
      }
      
      if (formattedItems.length === 0) {
        console.error('No valid items to create order with');
        return;
      }

      console.log('Creating order with data:', {
        userId,
        totalAmount,
        items: formattedItems
      });

      const orderData = {
        userId,
        totalAmount,
        items: formattedItems,
        paymentMethod: 'flouci'
      };

      // Create order
      await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(`Server error: ${response.status} - ${JSON.stringify(errorData)}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Order created successfully:', data);
        // Clear stored order items
        localStorage.removeItem('pendingOrderItems');
        localStorage.removeItem('pendingOrderAmount');
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4">{paymentStatus || 'Processing Payment...'}</h1>
    </div>
  );
};

export default Success;