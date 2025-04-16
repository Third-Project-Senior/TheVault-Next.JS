'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from '../../../components/AddProduct.jsx'
import { jwtDecode } from 'jwt-decode'

function ProductList() {
  const token = localStorage.getItem('token')
  const [ProductList, setProductList] = useState([])
  const [hidden, sethidden] = useState(null)
  const [name, setname] = useState('')
  const [price, setprice] = useState('')
  const [stock, setstock] = useState('')
  const [search, setsearch] = useState('')
  const [hiddenAdd, sethiddenAdd] = useState(true)

  if (!token || jwtDecode(token).role !== 'admin') {
    window.location.href = '/'
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
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product List</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <input
          type="text"
          className="px-4 py-2 border rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for a product"
          onChange={(e) => setsearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          onClick={() => sethiddenAdd(!hiddenAdd)}
        >
          Add Product
        </button>
      </div>

      <div className={`${hiddenAdd ? 'hidden' : 'block'} mb-6`}>
        <AddProduct sethiddenAdd={sethiddenAdd} hiddenAdd={hiddenAdd} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              {['Product ID', 'Product Name', 'Product Description', 'Price', 'Stock', 'Actions'].map((header, i) => (
                <th key={i} className="text-left px-4 py-3 border-b text-sm font-semibold text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ProductList.filter((e) =>
              e.name.toLowerCase().includes(search.toLowerCase())
            ).map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border-b">{product.id}</td>
                <td className="px-4 py-3 border-b">
                  {product.name}
                  <input
                    hidden={hidden !== product.id}
                    type="text"
                    defaultValue={product.name}
                    className="mt-2 block w-full px-2 py-1 border rounded-md"
                    onChange={(e) => setname(e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 border-b">
                  {product.description}
                  <input
                    hidden={hidden !== product.id}
                    type="text"
                    defaultValue={product.description}
                    className="mt-2 block w-full px-2 py-1 border rounded-md"
                    onChange={(e) => setname(e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 border-b">
                  {product.price}
                  <input
                    hidden={hidden !== product.id}
                    type="number"
                    defaultValue={product.price}
                    className="mt-2 block w-full px-2 py-1 border rounded-md"
                    onChange={(e) => setprice(e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 border-b">
                  {product.quantity}
                  <input
                    hidden={hidden !== product.id}
                    type="number"
                    defaultValue={product.quantity}
                    className="mt-2 block w-full px-2 py-1 border rounded-md"
                    onChange={(e) => setstock(e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 border-b space-x-2">
                  <button
                    hidden={hidden === product.id}
                    className="bg-blue-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    onClick={() => sethidden(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    hidden={hidden !== product.id}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                    onClick={async () => {
                      try {
                        await axios.put(
                          `http://localhost:3000/api/product/${product.id}`,
                          {
                            name: name,
                            price: price,
                            stock: stock
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`
                            }
                          }
                        )
                        sethidden(null)
                        fetchProducts()
                        setname('')
                        setprice('')
                        setstock('')
                      } catch (error) {
                        alert('Failed to update')
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:3000/api/product/${product.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`
                            }
                          }
                        )
                        fetchProducts()
                        alert('Deleted')
                      } catch (error) {
                        alert('Failed to delete')
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductList
