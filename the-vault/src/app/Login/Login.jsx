import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import './Login.css'

function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const navigate = useNavigate()
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
              navigate('/dashboard/Overview')
              }
              else if (jwtDecode(response.data.token).role === 'user') {
                  navigate('/profile')
              }
              else {
                  alert('Invalid role')
                  return
              }
              // console.log(response.data.token)
              // console.log(jwtDecode(response.data.token))
          } catch (error) {
              console.log(error)
          }
        }}
      >
        Login
      </button>

      <p className="login-footer">
        You don't have an account? <a href="SignUp" className="login-link">Sign up</a> here
      </p>
    </div>
  )
}

export default Login
