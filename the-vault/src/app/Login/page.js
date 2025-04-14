'use client'
import React, { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

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
                Swal.fire({
                  title: "Banned!",
                  text: "Your account has been banned. Please contact support.",
                  icon: "error",
                  draggable: true
                });
                  
                  return
              }

              localStorage.setItem('token', response.data.token)
              if( jwtDecode(response.data.token).role=== 'admin'){
                Swal.fire({
                  title: "Welcome Admin!",
                  text: "You have successfully logged in.",
                  icon: "success",
                  position: 'top-end',
                  showConfirmButton: false,
                  draggable: true
                });
                setTimeout(() => {
                  
                  router.push('/dashboard/Overview')
                }, 1500);
              
              }
              else if (jwtDecode(response.data.token).role === 'user') {
                Swal.fire({
                  title: "Welcome!",
                  text: "You have successfully logged in.",
                  icon: "success",
                  position: 'top-end',
                  showConfirmButton: false,
                  draggable: true
                });
                setTimeout(() => {
                  
                  router.push('/home')
                }, 1500);
              }
              else {
                  alert('Invalid role')
                  return
              }
              
          } catch (error) {
              console.log(error)
              Swal.fire({
                title: "Error!",
                text: "Invalid email or password.",
                icon: "error",
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
              });
              setTimeout(() => {
                router.push('/Login')
              }, 1000);
          }
        }}
      >
        Login
      </button>
      
      
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
