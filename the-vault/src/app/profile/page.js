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
  const token = localStorage.getItem('token');
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
        console.log(decodedToken);
        
        const response = await axios.get(`http://localhost:3000/api/user/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in.",
          icon: "success",
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });    
        
        setUserData(response.data);
        setError(null);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load profile data.",
          icon: "error",
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });

        console.error('Error fetching user data:', error);
        setError('Failed to load profile data. Please try again later.');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [  token]);

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
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>

      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-error">
        <p>No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">

      <div className="profile-header">
        <h1>Welcome, {userData.name}</h1>
        <p className="profile-subtitle">Manage your account details</p>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2>Your Details</h2>
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{userData.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{userData.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{userData.role.toUpperCase()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Joined:</span>
              <span className="detail-value">
                {new Date(userData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>

        <section className="profile-actions">
          <h2>Actions</h2>
          <div className="action-buttons">
            <button 
              className="profile-button primary"
              onClick={() => router.push('/orders')}
            >
              View Your Orders
            </button>
            <button 
              className="profile-button secondary"
              onClick={() => router.push('/settings')}
            >
              Account Settings
            </button>
            <button
              className="profile-button logout-button"
              onClick={handleLogout}
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