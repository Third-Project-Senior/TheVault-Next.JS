'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { CreditCard, DollarSign, Package, Users } from "lucide-react";
import { BarChart } from '@mui/x-charts';
import ProgressCard from '../ProgressCard';

function Overview() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        sales: 0,
        revenue: 0,
    });
    const [userSignups, setUserSignups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('week'); // week, month, year, all
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

                const [usersRes, productsRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/user', { headers }),
                    axios.get('http://localhost:3000/api/product', { headers }),
                    axios.get('http://localhost:3000/api/orders',{ headers })

                ]);


                const totalProducts = productsRes.data.reduce((sum, product) => sum + (product.quantity || 0), 0);
                // process sales
                const Orders = ordersRes.data
                console.log(Orders);
                
                const totalsales = Orders.reduce((sum,order)=>sum+parseInt(order.totalAmount),0)
                

                // Process user signups data
                const users = usersRes.data;
                const signupData = processUserSignups(users);
                

                setStats({
                    users: users.length,
                    products: totalProducts,
                    sales: totalsales,
                    revenue: (totalsales*80/100).toFixed(1)
                });

                setUserSignups(signupData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);



    const processUserSignups = (users) => {
        // Get dates for the last week
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Initialize data for each day of the week
        const days = [];
        const counts = [];
        const activeProjects = [10, 30, 44, 37, 25, 20, 35, 44, 15, 10, 30, 43]; // Sample data for active projects

        for (let i = 0; i < 7; i++) {
            const date = new Date(lastWeek.getTime() + i * 24 * 60 * 60 * 1000);
            days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            // Count users who signed up on this day
            const count = users.filter(user => {
                const signupDate = new Date(user.createdAt);
                return signupDate.toDateString() === date.toDateString();
            }).length;
            
            counts.push(count);
        }

        return {
            days,
            counts,
            activeProjects: activeProjects.slice(0, 7) // Use only 7 days of sample data
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="text-red-500 text-center mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Error</h2>
                    <p className="text-gray-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard Overview</h1>
                            <p className="mt-2 text-sm text-gray-500">Welcome back! Here's what's happening with your store today.</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Admin Dashboard
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {/* Users Stats */}
                    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">{stats.users}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Stats */}
                    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                                        <Package className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">{stats.products}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Stats */}
                    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                                        <CreditCard className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">{stats.sales || 'N/A'}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Stats */}
                    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-100">
                                        <DollarSign className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">{stats.revenue || 'N/A'}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        {/* Activity Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">User Activity</h2>
                                <div className="flex flex-wrap gap-2">
                                    {['week', 'month', 'year', 'all'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => setTimeRange(period)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                                ${timeRange === period 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {period.charAt(0).toUpperCase() + period.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                <BarChart
                                    xAxis={[{
                                        data: userSignups.days,
                                        scaleType: 'band',
                                    }]}
                                    series={[
                                        {
                                            data: userSignups.counts,
                                            label: 'New Users',
                                            color: '#2196f3',
                                        },
                                        {
                                            data: userSignups.activeProjects,
                                            label: 'Active Projects',
                                            color: '#9c27b0',
                                        },
                                    ]}
                                  
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <ProgressCard
                            progress={(stats.sales/5000*100).toFixed(1)}
                            title="Monthly Target :5000"
                            description="Track your monthly sales progress"
                            onDetailsClick={() => console.log('Details clicked')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;

