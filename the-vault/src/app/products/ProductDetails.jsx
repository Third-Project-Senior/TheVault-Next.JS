import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import {jwtDecode} from 'jwt-decode';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const detailsProduct = async () => {
            console.log("Product ID from params:", id);
            
            if (!id) {
                console.error("Product ID is missing");
                setError('Product ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("Fetching product with ID:", id);
                const response = await axios.get(`http://localhost:3000/api/product/${id}`);
                console.log("Product data received:", response.data);
                setProduct(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(`Failed to load product details: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        detailsProduct();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <h3 className="text-danger">{error}</h3>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/')}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center mt-5">
                <h3>Product not found</h3>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/')}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail-grid">
                <div className="product-image-container">
                    <img 
                        src={product.image} 
                        className="product-main-image" 
                        alt={product.name} 
                    />
                </div>
                <div className="product-info-container">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">${product.price}</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                        <div className="meta-item">
                            <i className="fas fa-star"></i>
                            <span>Rating: {product.rating} ⭐</span>
                        </div>
                        <div className="meta-item">
                            <i className="fas fa-box"></i>
                            <span>Quantity: {product.quantity}</span>
                        </div>
                        <div className="meta-item">
                            <i className="fas fa-tag"></i>
                            <span>Category: {product.category}</span>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button onClick={async()=>{
          try {
            await axios.post('http://localhost:3000/api/cart', {
              productId: product.id,
              quantity: 1,
              userId: jwtDecode(token).id,
            },{
              headers: {
                'Authorization': `Bearer ${token}`

                
              }

            });
            navigate("/cart")
            console.log("Product added to cart successfully");
          } catch (error) {
            console.log("Error adding to cart:", error);

            
          }
        }}className="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
