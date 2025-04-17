'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:3000/api/user/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      

        setUserData(response.data);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load profile data.",
          icon: "error",
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Swal.fire({
      title: "Logged Out!",
      text: "You have successfully logged out.",
      icon: "success",
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-red-50">
        <p className="text-red-700 font-semibold">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userData.name}</h1>
        <p className="text-gray-500">Manage your account details</p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Your Details</h2>
          <div className="grid grid-cols-1 gap-4 text-gray-700">
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Role:</strong> {userData.role.toUpperCase()}</div>
            <div><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => router.push('/orders')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Your Orders
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Account Settings
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
