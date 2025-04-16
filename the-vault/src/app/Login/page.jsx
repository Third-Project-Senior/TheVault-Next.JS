'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { GoogleLogin } from '@react-oauth/google'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const router = useRouter()

    const validateInputs = () => {
        const newErrors = {
            email: '',
            password: ''
        }
        let isValid = true

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleLogin = async () => {
        if (!validateInputs()) return
        
        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/api/user/login', {
                email: email,
                password: password
            })

            const decodedToken = jwtDecode(response.data.token)
            localStorage.setItem('token', response.data.token)

            if (decodedToken.status === 'banned') {
                Swal.fire({
                    title: "Banned!",
                    text: "Your account has been banned. Please contact support.",
                    icon: "error",
                    draggable: true
                })
                setIsLoading(false)
                return
            }

            const successConfig = {
                title: decodedToken.role === 'admin' ? "Welcome Admin!" : "Welcome!",
                text: "You have successfully logged in.",
                icon: "success",
                position: 'top-end',
                showConfirmButton: false,
                draggable: true
            }

            await Swal.fire(successConfig)

            const redirectPath = decodedToken.role === 'admin' 
                ? '/dashboard/Overview' 
                : decodedToken.role === 'user' 
                    ? '/home' 
                    : null

            if (!redirectPath) {
                alert('Invalid role')
                setIsLoading(false)
                return
            }

            router.push(redirectPath)

        } catch (error) {
            console.error(error)
            await Swal.fire({
                title: "Error!",
                text: "Invalid email or password.",
                icon: "error",
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
            })
            setIsLoading(false)
        }
    }

    const handleGoogleSuccess = (response) => {
        const decoded = jwtDecode(response.credential)
        console.log(decoded)

        // Add your Google login logic here
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        id="email"
                        type="email" 
                        placeholder="your.email@example.com" 
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        suppressHydrationWarning 
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="At least 8 characters" 
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                
                <button 
                    className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${
                        isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="flex justify-center pt-2">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Google login failed")}
                    />
                </div>
                
                <div className="text-center space-y-2 pt-4">
                    <p className="text-sm">
                        Forgot your password? <a href="/resetpassword" className="text-blue-500 hover:underline">Reset it</a>
                    </p>
                    <p className="text-sm">
                        Don't have an account? <a href="/SignUp" className="text-blue-500 hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login