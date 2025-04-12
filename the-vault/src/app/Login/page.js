'use client'
import React, { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const router = useRouter()
  return (
    <div className="login-container">
      <input 
        type="email" 
        placeholder="Your email" 
        className="login-input" 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Your password" 
        className="login-input" 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button 
        className="login-button" 
        onClick={async () => {
          try {
              const response = await axios.post('http://localhost:3000/api/user/login', {
                  email: email,
                  password: password
              })
              if (jwtDecode(response.data.token).status === 'banned') {
                  alert('Your account is banned')
                  return
              }

              localStorage.setItem('token', response.data.token)
              if( jwtDecode(response.data.token).role=== 'admin'){
                toast.success('Login successful!')
              router.push('/dashboard/Overview')
              }
              else if (jwtDecode(response.data.token).role === 'user') {
                toast.success('Login successful!')
                setTimeout(() => {
                  
                  router.push('/profile')
                }, 500);
              }
              else {
                  alert('Invalid role')
                  return
              }
              
          } catch (error) {
              console.log(error)
          }
        }}
      >
        Login
      </button>
      <ToastContainer />
      
      <p className="login-footer">
        Forgot your password? <a href="resetpassword" className="login-link">Reset it</a> here
      </p>

      <p className="login-footer">
        You don't have an account? <a href="SignUp" className="login-link">Sign up</a> here
      </p>
    </div>
  )
}

export default Login
