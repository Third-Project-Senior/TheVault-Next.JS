'use client'
import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import {useParams} from 'next/navigation'
import { useRouter } from 'next/navigation';
import {use}from 'react'
import Swal from "sweetalert2"


const ProductDetails = ({params}) => {
    const router = useRouter();
    const { id } = use(params);
    console.log("Product ID from params:", id);

    if (!id) {
      return <div>Product not found</div>;
    }
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
                    onClick={() => router.push('/products')}
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
                    onClick={() => router.push('/products')}
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
            Swal.fire({
              title: "Success!",
              text: "Product added to cart.",
              icon: "success",
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
            });
          } catch (error) {
            console.log("Error adding to cart:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to add product to cart.",
              icon: "error",
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }}className="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            </div>
            {/* <section className="comment-section" >
                <div className="comment-input" >
                    <input className="comment-input" type="text" placeholder="Comment" onChange={(e)=>setComment(etargetvalue)} />
                    <button className="comment-btn"
                    onClick={()=>{

                    }}
                    >Comment</button>
                </div>
                <div className="comment-list">
                    {comments.map((comment)=>{})}
                </div>
                
                
            </section> */}
        </div>
    );
};

export default ProductDetails;
