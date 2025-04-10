import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './SignUp.css'

function SignUp() {
    const navigate = useNavigate()
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
                            alert(response.data)
                            navigate('/Login')
                        } catch (error) {
                            alert(error.response.data)
                            console.log(error)
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
