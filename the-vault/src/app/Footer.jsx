import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>Your trusted destination for quality products and exceptional service.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Info</h5>
            <ul>
              <li><a href="tel:+1234567890">+216 93548814 </a></li>
              <li><a href="mailto:info@vault.com">thevault@gmail.com</a></li>
            </ul>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>&copy; 2025 Vault. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;