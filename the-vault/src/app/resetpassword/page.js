'use client'
import React, { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import emailjs from '@emailjs/browser'
import swal from 'sweetalert2'

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
                        swal.fire({
                            title: "Error!",
                            text: "Code is incorrect, try again!",
                            icon: "error",
                            draggable: true
                            timer: 1500,
                        });                        
                        return
                    }
                    try {
                        const response = await axios.put(`http://localhost:3000/api/user/reset/${email}`, {
                            password: newPassword
                        })
                        console.log(response.data)
                        swal.fire({
                            title: "Success!",
                            text: "Password reset successfully.",
                            icon: "success",
                            draggable: true
                            timer: 1500,
                        });
                        setTimeout(() => {
                            router.push('/login')
                        }, 1500);
                    } catch (error) {
                        console.error(error)
                        swal.fire({
                            title: "Error!",
                            text: "Failed to reset password.",
                            icon: "error",
                            draggable: true
                            timer: 1500,
                        });
                }}
            }
            >
                Reset Password
            </button>
            </div>

      
    </div>
  )
}

export default page
