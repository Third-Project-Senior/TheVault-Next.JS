'use client';
import React from 'react';
import FeaturedItems from './home/FeaturedItems'; // Adjust the import path as necessary
const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-md-6">
              <h1 className="hero-title">Discover Unique Antique Treasures</h1>
              <p className="hero-text">
                Explore our curated collection of rare and beautiful antiques from around the world.
                Each piece tells a unique story waiting to be discovered.
              </p>
              <a href="/shop" className="btn btn-primary btn-lg">
                Explore Collection
              </a>
            </div>
            <div className="col-md-6">
              <img
                src="https://images-cdn.ubuy.co.in/635e0b1d3f834e34592dc8ad-metal-antique-vintage-car-model.jpg"
                alt="Antique Collection"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <section className="featured-items py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold mb-6">Featured Products</h2>
          <FeaturedItems />
        </div>
      </section>
    </div>
  );
};

export default Home;
