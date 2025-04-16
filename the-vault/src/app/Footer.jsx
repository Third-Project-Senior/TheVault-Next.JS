import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">About Us</h5>
            <p className="text-gray-300">
              Your trusted destination for quality products and exceptional service.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
              <li><a href="/shop" className="text-gray-300 hover:text-white transition">Shop</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">Contact Info</h5>
            <ul className="space-y-2">
              <li>
                <a href="tel:+21693548814" className="text-gray-300 hover:text-white transition">
                  +216 93548814
                </a>
              </li>
              <li>
                <a href="mailto:thevault@gmail.com" className="text-gray-300 hover:text-white transition">
                  thevault@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Vault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;