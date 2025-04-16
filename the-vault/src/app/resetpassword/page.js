'use client';
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [mailcode, setMailCode] = useState(Math.floor(100000 + Math.random() * 900000));
  const [hidden, setHidden] = useState(true);
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_5zgas7i', 'template_tu1esar', form.current, {
        publicKey: '3un8XpX-W6r_fZeF2',
      })
      .then(
        () => {
          console.log('SUCCESS!', mailcode);
          setHidden(false);
        },
        (error) => {
          console.log('FAILED...', error);
        }
      );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>

        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="user_email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input hidden type="text" name="code" value={mailcode} readOnly />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Send Verification Code
          </button>
        </form>

        {!hidden && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter Verification Code</label>
              <input
                type="text"
                placeholder="Your code"
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                placeholder="Your new password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
              onClick={async () => {
                if (code != mailcode) {
                  Swal.fire({
                    title: 'Error!',
                    text: 'Code is incorrect, try again!',
                    icon: 'error',
                    timer: 1500,
                    position: 'top-end',
                    showConfirmButton: false,
                  });
                  return;
                }
                try {
                  const response = await axios.put(
                    `http://localhost:3000/api/user/reset/${email}`,
                    { password: newPassword }
                  );
                  console.log(response.data);
                  Swal.fire({
                    title: 'Success!',
                    text: 'Password reset successfully.',
                    icon: 'success',
                    timer: 1500,
                    position: 'top-end',
                    showConfirmButton: false,
                  });
                  setTimeout(() => {
                    router.push('/login');
                  }, 1500);
                } catch (error) {
                  console.error(error);
                  Swal.fire({
                    title: 'Error!',
                    text: 'Failed to reset password.',
                    icon: 'error',
                    timer: 1500,
                    position: 'top-end',
                    showConfirmButton: false,
                  });
                }
              }}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
