import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import './ProductList.css'
import SideBar from './SideBar'
import AddProduct from './AddProduct'
import { jwtDecode } from 'jwt-decode'

function ProductList() {
  const token = localStorage.getItem('token')
  const [ProductList, setProductList] = useState([])
  const [hidden, sethidden] = useState( null)
  const [name, setname] = useState('')
  const [price, setprice] = useState('')
  const [stock, setstock] = useState('')
  const [search, setsearch] = useState('')
  const [hiddenAdd, sethiddenAdd] = useState(true)


  if (!token||jwtDecode(token).role !== 'admin') {
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
    <>
    <div className='sidebar'>

        <SideBar/>
    </div>

    <div className="productlist-container">
      <h1 className="productlist-title">Product List</h1>
      <div className='filter-add'>
        <input type="text" className='search' placeholder='Search for a product' onChange={(e)=>setsearch(e.target.value)} />
        <button className="add-btn" onClick={() => {
          sethiddenAdd(!hiddenAdd)
          }}>Add Product</button>
      </div>
        <div className='add-product' hidden={hiddenAdd}>
            <AddProduct sethiddenAdd={sethiddenAdd} hiddenAdd={hiddenAdd} />
        </div>
      <div className="productlist-table-wrapper">
        <table className="productlist-table">
          <thead>
            <tr>
              <th className="productlist-header">Product ID</th>
              <th className="productlist-header">Product Name</th>
              <th className="productlist-header">Product Description</th>
              <th className="productlist-header">Price</th>
              <th className="productlist-header">Stock</th>
              <th className="productlist-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ProductList.filter((e)=>e.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
              <tr key={product.id} className="productlist-row">
                <td className="productlist-cell">{product.id}</td>
                <td className="productlist-cell">
                  {product.name}
                  <input
                    hidden={hidden!==product.id}
                    type="text"
                    defaultValue={product.name}
                    className="productlist-input"
                    onChange={(e) => setname(e.target.value)}
                  />
                </td>
                <td className="productlist-cell">
                  {product.description}
                  <input
                    hidden={hidden!==product.id}
                    type="text"
                    defaultValue={product.description}
                    className="productlist-input"
                    onChange={(e) => setname(e.target.value)}
                  />
                </td>
                <td className="productlist-cell">
                  {product.price}
                  <input
                    hidden={hidden!==product.id}
                    type="number"
                    defaultValue={product.price}
                    className="productlist-input"
                    onChange={(e) => setprice(e.target.value)}
                  />
                </td>
                <td className="productlist-cell">
                  {product.quantity}
                  <input
                    hidden={hidden!==product.id}
                    type="number"
                    defaultValue={product.quantity}
                    className="productlist-input"
                    onChange={(e) => setstock(e.target.value)}
                  />
                </td>
                <td className="productlist-cell productlist-actions">
                  <button
                    hidden={hidden===product.id}
                    className="edit-btn"
                    onClick={() => sethidden(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    hidden={hidden!==product.id}
                    className="edit-btn"
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
                    className="delete-btn"
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
    </>
  )
}

export default ProductList
