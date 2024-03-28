import React from 'react'
import Layout from '../../components/Layout'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [answer, setAnswer] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const res = await axios.post('/forgot-password', {email, password, answer})
            if(res && res.data.success){
              toast.success(res.data.message)
              navigate('/login')
            }
            else{
                toast.error(res.data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error)
        }
    }
  return (
    <Layout title='Forgot Password - Unknown Brand'>
        <div className='register'>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="email" className="form-control" id="exampleInputEmail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword" placeholder='password' required/>
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputAnswer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder='Your favourite sports' required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </Layout>
  )
}

export default ForgotPassword