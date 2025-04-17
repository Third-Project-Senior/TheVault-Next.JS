'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from '../../../components/AddProduct.jsx'
import { jwtDecode } from 'jwt-decode'
import { Search, Edit2, Save, Trash2, Plus, X } from 'lucide-react'

function ProductList() {
  const token = localStorage.getItem('token')
  const [productList, setProductList] = useState([])
  const [hidden, setHidden] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [search, setSearch] = useState('')
  const [hiddenAdd, setHiddenAdd] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  if (!token || jwtDecode(token).role !== 'admin') {
    window.location.href = '/'
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/product', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setProductList(response.data)
      setError(null)
    } catch (error) {
      setError('Failed to fetch products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleUpdate = async (productId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/product/${productId}`,
        {
          name: name || undefined,
          price: price || undefined,
          stock: stock || undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setHidden(null)
      fetchProducts()
      setName('')
      setPrice('')
      setStock('')
    } catch (error) {
      alert('Failed to update product')
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `http://localhost:3000/api/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        fetchProducts()
      } catch (error) {
        alert('Failed to delete product')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
          <button
            onClick={fetchProducts}
            className="text-blue-500 hover:text-blue-600"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your product inventory</p>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setHiddenAdd(!hiddenAdd)}
          >
            {hiddenAdd ? (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </>
            ) : (
              <>
                <X className="h-5 w-5 mr-2" />
                Cancel
              </>
            )}
          </button>
        </div>

        {/* Add Product Form */}
        <div className={`${hiddenAdd ? 'hidden' : 'block'} mb-6`}>
          <AddProduct setHiddenAdd={setHiddenAdd} hiddenAdd={hiddenAdd} />
        </div>

        {/* Product Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Name', 'Description', 'Price', 'Stock', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productList
                  .filter((product) =>
                    product.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hidden === product.id ? (
                          <input
                            type="text"
                            defaultValue={product.name}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setName(e.target.value)}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {hidden === product.id ? (
                          <input
                            type="text"
                            defaultValue={product.description}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setName(e.target.value)}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{product.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hidden === product.id ? (
                          <input
                            type="number"
                            defaultValue={product.price}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">${product.price}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hidden === product.id ? (
                          <input
                            type="number"
                            defaultValue={product.quantity}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => setStock(e.target.value)}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{product.quantity}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {hidden === product.id ? (
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() => handleUpdate(product.id)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setHidden(product.id)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        )}
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {productList.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found</div>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setHiddenAdd(false)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add your first product
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
