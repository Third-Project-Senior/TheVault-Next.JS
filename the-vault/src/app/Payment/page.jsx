'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4">{paymentStatus || 'Processing Payment...'}</h1>
    </div>
  );
};

export default Success;