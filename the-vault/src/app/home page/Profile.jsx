import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

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
        
        setUserData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data. Please try again later.');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
        <h1>Welcome, {userData.username}</h1>
        <p className="profile-subtitle">Manage your account details</p>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2>Your Details</h2>
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{userData.username}</span>
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
              onClick={() => navigate('/orders')}
            >
              View Your Orders
            </button>
            <button 
              className="profile-button secondary"
              onClick={() => navigate('/settings')}
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