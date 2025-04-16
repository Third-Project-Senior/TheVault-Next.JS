'use client';
import React from 'react';
import FeaturedItems from './home/FeaturedItems'; // Adjust path as needed

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 max-w-7xl mx-auto">
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Unique Antique Treasures
          </h1>
          <p className="text-gray-600 mb-6">
            Explore our curated collection of rare and beautiful antiques from around the world.
            Each piece tells a unique story waiting to be discovered.
          </p>
          <a
            href="/shop"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore Collection
          </a>
        </div>

        {/* Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img
            src="https://images-cdn.ubuy.co.in/635e0b1d3f834e34592dc8ad-metal-antique-vintage-car-model.jpg"
            alt="Antique Collection"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Featured Items Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Featured Items</h2>
          <FeaturedItems />
        </div>
      </section>
    </div>
  );
};

export default Home;
