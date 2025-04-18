'use client';
import React, { useEffect } from 'react';
import FeaturedItems from './home/FeaturedItems';
import Categories from './home/Categories';
import Link from 'next/link';

const Home = () => {
  useEffect(() => {
    () => window.location.reload();
  }, []);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/247929/pexels-photo-247929.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Antique Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-serif mb-4">ANTIQUE STORE</h1>
            <p className="text-xl font-serif max-w-2xl mx-auto">
              THE BEST QUALITY OF ANTIQUES
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-center text-3xl font-serif mb-12">WELCOME TO OUR STORE</h2>
        <Categories />
      </div>

      {/* Featured Items Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif text-center mb-12">Featured Items</h2>
          <FeaturedItems />
        </div>
      </section>

      {/* Sale Banner */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1095601/pexels-photo-1095601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Sale Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <span className="inline-block font-serif text-2xl mb-4 tracking-wider">Discover Timeless Treasures</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-wide">The World's Best Antiques</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <h3 className="text-4xl md:text-6xl font-serif mb-8 tracking-widest">BIG SALE</h3>
            <Link 
              href="/shop" 
              className="inline-block border-2 border-white text-white px-12 py-4 text-lg font-serif tracking-wider hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
