import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeaturedItems from './FeaturedItems';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col md={6}>
              <h1 className="hero-title">Discover Unique Antique Treasures</h1>
              <p className="hero-text">
                Explore our curated collection of rare and beautiful antiques from around the world.
                Each piece tells a unique story waiting to be discovered.
              </p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Explore Collection
              </Link>
            </Col>
            <Col md={6}>
              <img
                src="https://images-cdn.ubuy.co.in/635e0b1d3f834e34592dc8ad-metal-antique-vintage-car-model.jpg"
                alt="Antique Collection"
                className="hero-image"
              />
            </Col>
          </Row>
        </Container>
      </div>

     
      {/* Featured Items */}
      <FeaturedItems />
    </div>
  );
};

export default Home;
