'use client'
import React from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import swal from 'sweetalert2'

function SignUp() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [name, setName] = React.useState('')

    return (
        <div className="signup-container">
            <form className="signup-form">
                <input 
                    type="text" 
                    placeholder="Set name" 
                    className="signup-input" 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Set password" 
                    className="signup-input" 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Set e-mail" 
                    className="signup-input" 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button 
                    type="button" 
                    className="signup-button" 
                    onClick={async () => {
                        try {
                            const response = await axios.post('http://localhost:3000/api/user/signup', {
                                email,
                                password,
                                name
                            })
                            console.log(response.data)
                            swal.fire({
                                title: "Success!",
                                text: "Account created successfully.",
                                icon: "success",
                                draggable: true,
                                timer: 1500,
                            });
                            setTimeout(() => {
                                router.push('/Login')
                            }, 1500);
                        } catch (error) {
                            swal.fire({
                                title: "Error!",
                                text: error.response.data,
                                icon: "error",
                                draggable: true,
                                timer: 1500,
                            });
                            console.error(error)
                            setError('Failed to create account. Please try again later.')
                        }
                    }}
                >
                    Sign Up
                </button>
                <p className="signup-footer">
                    Already have an account? <a href="/Login" className="signup-link">Log in</a>
                </p>
            </form>
        </div>
    )
}

export default SignUp
