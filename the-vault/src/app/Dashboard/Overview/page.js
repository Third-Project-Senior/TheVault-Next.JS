'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { CreditCard, DollarSign, Package, Users } from "lucide-react";

function Overview() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        sales: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                router.push('/');
                return;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                const [usersRes, productsRes, salesRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/user', { headers }),
                    axios.get('http://localhost:4000/api/product', { headers }),
                    axios.get('http://localhost:4000/api/sales', { headers })
                ]);

                const totalProducts = productsRes.data.reduce((sum, product) => sum + product.quantity, 0);
                const totalRevenue = salesRes.data.reduce((sum, sale) => sum + sale.total, 0);

                setStats({
                    users: usersRes.data.length,
                    products: totalProducts,
                    sales: salesRes.data.length,
                    revenue: totalRevenue
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600 text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Users</h2>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.users}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Products</h2>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.products}</p>
                        </div>
                        <Package className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Sales</h2>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.sales}</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Revenue</h2>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">${stats.revenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;
