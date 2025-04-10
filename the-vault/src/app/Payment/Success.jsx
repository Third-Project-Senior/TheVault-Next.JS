import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
const navigate = useNavigate()
  useEffect(() => {
    const paymentId = new URLSearchParams(window.location.search).get('payment_id');
    console.log(paymentId, "sousou");

    if (!paymentId) {
      window.location.href = '/'; 
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/payment/verify/${paymentId}`);
        
        if (response.data.success === true) {
          setPaymentStatus('Payment Successful!');
       
          

        } else {
          setPaymentStatus('Payment verification failed');
        }
      } catch (error) {
        console.error("Verification failed", error);
        setPaymentStatus('error');
      }
    };

    verifyPayment();
  }, []);
  const PaymentSuccess = () => {
    useEffect(() => {
      Swal.fire({
        title: "Payment Successful!",
        text: "Thank you for your purchase. Your payment has been processed successfully.",
        icon: "success",
        confirmButtonText: "Awesome!",
        confirmButtonColor: "#4CAF50",
        timer: 3000,
        timerProgressBar: true,
      });
    }, [])
    setTimeout(()=>    navigate("/")
 , 2000 )

  }
  return (
<div>{PaymentSuccess()} </div>
  );
};

export default Success;
