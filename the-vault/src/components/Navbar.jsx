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
  const [isScrolled, setIsScrolled] = useState(false);
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

    // Add scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-3xl font-serif hover:text-gray-300 transition-colors">
            <Link href="/" className="flex items-center">
              <span className="text-white">The</span>
              <span className="text-white ml-1">Vault</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center text-white hover:text-gray-300 transition-colors font-serif ${pathname === '/' ? 'border-b-2 border-white' : ''}`}
            >
              <FiHome className="mr-2" /> Home
            </Link>
            
            <Link 
              href="/shop" 
              className={`flex items-center text-white hover:text-gray-300 transition-colors font-serif ${pathname === '/shop' ? 'border-b-2 border-white' : ''}`}
            >
              <FiShoppingCart className="mr-2" /> Shop
            </Link>

            {/* Cart Link with Badge */}
            <Link 
              href="/cart" 
              className={`flex items-center text-white hover:text-gray-300 transition-colors font-serif relative ${pathname === '/cart' ? 'border-b-2 border-white' : ''}`}
            >
              <FiShoppingCart className="mr-2" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-serif">
                  {cartItemsCount}
                </span>
              )}
              Cart
            </Link>

            {isLoggedIn && (
              <Link 
                href="/profile" 
                className={`flex items-center text-white hover:text-gray-300 transition-colors font-serif ${pathname === '/profile' ? 'border-b-2 border-white' : ''}`}
              >
                <FiUser className="mr-2" /> Profile
              </Link>
            )}

            {userRole === 'admin' && (
              <Link 
                href="/Dashboard/Overview" 
                className={`flex items-center text-white hover:text-gray-300 transition-colors font-serif ${pathname === "/Dashboard/Overview" ? 'border-b-2 border-white' : ''}`}
              >
                Admin
              </Link>
            )}

            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center text-white hover:text-gray-300 transition-colors font-serif"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                className={`flex items-center text-white hover:text-gray-300 transition-colors font-serif ${pathname === '/login' ? 'border-b-2 border-white' : ''}`}
              >
                <FiLogIn className="mr-2" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon with Badge */}
            <Link href="/cart" className="relative text-white">
              <FiShoppingCart className="text-xl" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-serif">
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
          <Link href="/" className="block text-white hover:text-gray-300 px-3 py-2 font-serif">Home</Link>
          <Link href="/shop" className="block text-white hover:text-gray-300 px-3 py-2 font-serif">Shop</Link>
          <Link href="/cart" className="block text-white hover:text-gray-300 px-3 py-2 font-serif flex items-center">
            Cart
            {cartItemsCount > 0 && (
              <span className="ml-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-serif">
                {cartItemsCount}
              </span>
            )}
          </Link>
          {isLoggedIn && <Link href="/profile" className="block text-white hover:text-gray-300 px-3 py-2 font-serif">Profile</Link>}
          {userRole === 'admin' && <Link href="/Dashboard/Overview" className="block text-white hover:text-gray-300 px-3 py-2 font-serif">Admin</Link>}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="block w-full text-left text-white hover:text-gray-300 px-3 py-2 font-serif">
              Logout
            </button>
          ) : (
            <Link href="/login" className="block text-white hover:text-gray-300 px-3 py-2 font-serif">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;