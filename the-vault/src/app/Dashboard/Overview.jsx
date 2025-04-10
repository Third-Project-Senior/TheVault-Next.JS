import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import SideBar from './SideBar'
import './Overview.css'
import { jwtDecode } from 'jwt-decode'

function Overview() {
    const [UserList, setUserList] = useState([])
    const [ProductList, setProductList] = useState([])
    const [SalesList, setSalesList] = useState([])
    const token = localStorage.getItem('token')

    if (!token||jwtDecode(token).role !== 'admin') {
        window.location.href = '/'
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUserList(response.data)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/product', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setProductList(response.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }
    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/sales', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setSalesList(response.data)
            
        } catch (error) {
            console.error('Error fetching sales:', error)
            
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchProducts()
        fetchSales()
    }, [])

    return (
        <div className='dashboard'>
        <div className='sidebar'>
            <SideBar />
        </div>
            <div className="overview-container">
                <h1 className="overview-header">Overview</h1>
                <div className="flex flex-col bg-gray">
                    <div className="overview-card">
                        <h2 className="overview-card-title">Active Users</h2>
                        <p className="overview-card-text">{UserList.length}</p>
                    </div>
                    <div className="overview-card">
                        <h2 className="overview-card-title">Total Products</h2>
                        <p className="overview-card-text">
                            {ProductList.reduce((sum, product) => sum + product.quantity, 0)}
                        </p>
                    </div>
                    <div className="overview-card">
                        <h2 className="overview-card-title">Total Sales</h2>
                        <p className="overview-card-text">{SalesList.length}</p>
                    </div>
                    <div className="overview-card">
                        <h2 className="overview-card-title">Total revenue</h2>
                        <p className="overview-card-text">${SalesList.reduce((sum,sales)=>sum+sales.total,0)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview

