import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [answer, setAnswer] = useState('');
    const navigate = useNavigate()

    const handleSubmit =async (e) => {
        e.preventDefault()
        try{
            const res = await axios.post('/register', {name, email, password, phone, address, answer})
            if(res && res.data.success){
                toast.success(res.data.message)
                navigate('/login')
            }
        }
        catch(error){
            console.log(error)
            toast.error("Something went wrong")
        }
    }
    return (
        <Layout>
        <div className='register'>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputName" value={name} onChange={(e) => setName(e.target.value)} placeholder='name' required/>
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control" id="exampleInputEmail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword" placeholder='password' required/>
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputPhone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='phone' required/>
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='address' required/>
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

export default Register;