import React from 'react'
import { useState } from 'react'
import axios from 'axios'

function AddProduct({sethiddenAdd, hiddenAdd}) {
    const token = localStorage.getItem('token')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [description, setDescription] = useState('')
    const [rating, setRating] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [productList, setProductList] = useState([])
    const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/product', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          setProductList(response.data)
          sethiddenAdd(true)
        } catch (error) {
          console.log(error)
        }
      }
  return (
    <div>
        <h1>Add Product</h1>
        <form >
            <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input type="text" id="name"  onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="number" id="price"  onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock"  onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div className='form-group'>
              <label htmlFor="description">Description</label>
            <input type="text" id="description"  onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className='form-group'>
              <label htmlFor="rating">Rating</label>
            <input type="number" id="rating"  onChange={(e) => setRating(e.target.value)} required />
            </div>
            <div className='form-group'>
              <label htmlFor="category">Category</label>
            {/* <input type="text" id="category"  onChange={(e) => setCategory(e.target.value)} required /> */}
              
            </div>
            <div className='form-group'>
              <label htmlFor="image">Image</label>
            <input type="file" id="image" accept='image/*'  required onChange={async(e)=>{
              const file = e.target.files[0]
              console.log(file);
              
              if (!file) return
              const formData = new FormData()
              formData.append('file', file)
              formData.append("upload_preset",'movies') // Replace with your Cloudinary upload preset
              const response = await axios.post('https://api.cloudinary.com/v1_1/dj9eduznp/image/upload', formData) // Replace with your Cloudinary URL
              setImage(response.data.secure_url) // Set the image URL to state
              console.log("image",response.data.secure_url)
            }} />
            </div>
            <button className='submit' type="submit" onClick={async()=>{
               try {
                const response = await axios.post('http://localhost:3000/api/product', {
                    name,
                    price,
                    quantity: stock,
                    description: description,
                    rating: rating,
                    category: category,
                    image: image
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                fetchProducts()
            } catch (error) {
                console.log(error)
            }
            }}  >Add Product</button>
        </form>
    </div>
  )
}

export default AddProduct
