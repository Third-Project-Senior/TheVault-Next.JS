'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FiShoppingCart, FiUser, FiHome, FiLogIn, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItemsCount(cart.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/Login';
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold hover:text-gray-300 transition-colors">
            <a href="/" className="flex items-center">
              <span className="text-blue-400">The</span>Vault
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center hover:text-blue-400 transition-colors ${pathname === '/' ? 'text-blue-400 font-medium' : ''}`}
            >
              <FiHome className="mr-1" /> Home
            </Link>
            
            <Link 
              href="/shop" 
              className={`flex items-center hover:text-blue-400 transition-colors ${pathname === '/shop' ? 'text-blue-400 font-medium' : ''}`}
            >
              <FiShoppingCart className="mr-1" /> Shop
            </Link>

            {/* Cart Link with Badge */}
            <Link 
              href="/cart" 
              className={`flex items-center hover:text-blue-400 transition-colors relative ${pathname === '/cart' ? 'text-blue-400 font-medium' : ''}`}
            >
              <FiShoppingCart className="mr-1" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
              Cart
            </Link>

            {isLoggedIn && (
              <Link 
                href="/profile" 
                className={`flex items-center hover:text-blue-400 transition-colors ${pathname === '/profile' ? 'text-blue-400 font-medium' : ''}`}
              >
                <FiUser className="mr-1" /> Profile
              </Link>
            )}

            {userRole === 'admin' && (
              <Link 
                href="/Dashboard/Overview" 
                className={`flex items-center hover:text-blue-400 transition-colors ${pathname === "/Dashboard/Overview" ? 'text-blue-400 font-medium' : ''}`}
              >
                Admin Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center hover:text-red-400 transition-colors"
              >
                <FiLogOut className="mr-1" /> Logout
              </button>
            ) : (
              <Link 
                href="/Login" 
                className={`flex items-center hover:text-blue-400 transition-colors ${pathname === '/Login' ? 'text-blue-400 font-medium' : ''}`}
              >
                <FiLogIn className="mr-1" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon with Badge */}
            <Link href="/cart" className="relative">
              <FiShoppingCart className="text-xl" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <button className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation (hidden by default) */}
        <div className="md:hidden hidden mt-4 pb-2 space-y-3">
          <Link href="/" className="block hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
          <Link href="/shop" className="block hover:bg-gray-700 px-3 py-2 rounded">Shop</Link>
          <Link href="/cart" className="block hover:bg-gray-700 px-3 py-2 rounded flex items-center">
            Cart
            {cartItemsCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          {isLoggedIn && <Link href="/profile" className="block hover:bg-gray-700 px-3 py-2 rounded">Profile</Link>}
          {userRole === 'admin' && <Link href="/Dashboard/Overview" className="block hover:bg-gray-700 px-3 py-2 rounded">Admin</Link>}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded">
              Logout
            </button>
          ) : (
            <Link href="/Login" className="block hover:bg-gray-700 px-3 py-2 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;