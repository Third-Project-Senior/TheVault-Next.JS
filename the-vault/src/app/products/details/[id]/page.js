'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Comments from '../../../../components/Comments.jsx';
import Swal from "sweetalert2";

const ProductDetails = ({ params }) => {
    const router = useRouter();
    const { id } = useParams();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]); // State for categories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/product/${id}`);
                setProduct(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(`Failed to load product details: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/category/getAll'); // Replace with your API endpoint
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProduct();
        fetchCategories(); // Fetch categories
    }, [id]);

    const handleAddToCart = async () => {
        if (!token) {
            Swal.fire({
                title: "Login Required",
                text: "Please login to add items to your cart",
                icon: "warning",
                showConfirmButton: true,
            }).then(() => {
                router.push('/Login');
            });
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/cart', {
                productId: product.id,
                quantity: 1,
                userId: jwtDecode(token).id,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Swal.fire({
                title: "Added to Cart!",
                text: `${product.name} has been added to your cart`,
                icon: "success",
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to add to cart",
                icon: "error",
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mb-4">
                    {error}
                </div>
                <button 
                    onClick={() => router.push('/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded max-w-md mb-4">
                    Product not found
                </div>
                <button 
                    onClick={() => router.push('/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Product Details Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="md:flex">
                    {/* Product Image */}
                    <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
                        <img 
                            src={product.image || '/placeholder-product.jpg'} 
                            className="max-h-96 w-auto object-contain"
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="md:w-1/2 p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                        
                        <div className="flex items-center mb-6">
                            <span className="text-2xl font-semibold text-gray-900">${product.price?.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>

                        <div className="flex items-center mb-6">
                            {/* <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="text-yellow-400">
                                        {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                                    </span>
                                ))}
                                <span className="ml-2 text-gray-600">({product.rating?.toFixed(1)})</span>
                            </div> */}
                            <span className="mx-4 text-gray-300">|</span>
                            <span className="text-gray-600">{product.quantity} in stock</span>
                        </div>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        <div className="mb-6">
                            <span className="text-sm text-gray-500">Category:</span>
                            <span className="ml-2 text-gray-700">{categories.map((category) =>{
                                return category.id===product.categoryId?category.name:""
                            })}</span>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                <Comments productId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetails;