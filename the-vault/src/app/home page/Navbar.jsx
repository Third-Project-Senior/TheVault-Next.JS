import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import '../css/Navbar.css';

const MyNavbar = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = token ? jwtDecode(token).role : 'no token';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-name">VAULT</span>
        </Link>
        
        <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
        <label htmlFor="navbar-toggle" className="navbar-toggle-label">
          <span className="hamburger"></span>
        </label>
        
        <div className="navbar-menu">
          <div className="navbar-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}
            >
              Shop
            </Link>
            {['admin', 'user'].includes(role) && (
              <Link 
                to="/cart" 
                className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
              >
                <FaShoppingCart className="cart-icon" />
              </Link>
            )}
          </div>
          
          <div className="navbar-auth">
            <Link 
              to={token ? '/profile' : '/login'} 
              className="auth-btn outline"
            >
              <FaUser className="auth-icon" />
              {token ? 'Profile' : 'Login'}
            </Link>
            <Link 
              to="/signup" 
              className="auth-btn solid"
            >
              Get Started
            </Link>
            {role === 'admin' && (
              <Link 
                to="/Dashboard/Overview" 
                className="auth-btn solid"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;