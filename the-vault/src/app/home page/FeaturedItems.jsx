import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeaturedItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product');
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        setProducts(data); // Show all products
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-items py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Featured Products</h2>
          <div className="text-center">Loading...</div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-items py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Featured Products</h2>
          <div className="text-center text-danger">Error: {error}</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-items py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Featured Products</h2>
        <Row className="g-4">
          {products.slice(0,4).map(product => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 product-card">
                <div className="product-image-container">
                  <Card.Img 
                    variant="top" 
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">{product.name}</Card.Title>
                  <Card.Text className="product-price">${product.price}</Card.Text>
                  <Link 
                    to={`/product/${product.id}`} 
                    className="btn btn-primary mt-auto"
                  >
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedItems;
