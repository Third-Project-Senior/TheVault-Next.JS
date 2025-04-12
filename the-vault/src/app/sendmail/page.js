'use client'
import React, { useRef,useState,useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function page() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [code, setCode] = useState('')
  const [mailcode, setMailCode] = useState(Math.floor(100000 + Math.random() * 900000))
  const [hidden, sethidden] = useState(true)
    const form = useRef();
    const sendEmail = (e) => {
        e.preventDefault();
        
    
        emailjs
          .sendForm('service_5zgas7i', 'template_tu1esar', form.current, {
            publicKey: '3un8XpX-W6r_fZeF2',
          })
          .then(
            () => {
              console.log('SUCCESS!',mailcode);
              sethidden(false)

            },
            (error) => {
              console.log('FAILED...', error);
            },
          );
      };
      return (
        <>
        <form ref={form} onSubmit={sendEmail}>
        
        <label>Email</label>
        <input type="email"
         name="user_email" 
         onChange={(e) => setEmail(e.target.value)}
         />
       
        <label hidden={true}>Code</label>
        <input hidden={true} type="text" name="code" value={mailcode}  />
        <input type="submit" value="Send" />
      </form>
      <div>

<div className="login-input" hidden={hidden} >
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
                console.log("input code",code,"mail code", mailcode);
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
                console.log("input code",code,"mail code", mailcode);
                alert('Failed to reset password',code,mailcode)
            }
        }}
    >
        Reset Password
    </button>
    </div>


</div>
        </>

      );
}

export default page
