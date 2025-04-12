'use client'
import React, { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import emailjs from '@emailjs/browser'

function page() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [code, setCode] = useState('')
    const [mailcode, setMailCode] = useState('')


   
    

  return (
    <div>

        <div className="login-input" >
            <input 
                type="text" 
                placeholder="Your code" 
                className="login-input" 
                onChange={(e) => setCode(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Your new password" 
                className="login-input" 
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button 
                className="login-button" 
                onClick={async () => {
                    if (code != mailcode) {
                        console.log(code, mailcode);
                        alert('Invalid code try another code')
                        
                        return
                    }
                    try {
                        const response = await axios.put(`http://localhost:3000/api/user/reset/${email}`, {
                            password: newPassword
                        })
                        console.log(response.data)
                        alert('Password reset successfully')
                        router.push('/Login')
                    } catch (error) {
                        console.error(error)
                        alert('Failed to reset password')
                    }
                }}
            >
                Reset Password
            </button>
            </div>

      
    </div>
  )
}

export default page
