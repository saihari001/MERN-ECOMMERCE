import {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import Layout from '../../components/Layout'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const handleSubmit =async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post('/login', {email, password})
      if(res.data.success===true){
        toast.success(res.data.message)
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        })
        localStorage.setItem('auth', JSON.stringify(res.data))
        navigate(location.state || '/')
      }
      else{
        toast.error("invalid creditional")
      }
    }
    catch(error){
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  return (
    <Layout title='Login - Unknown Brand'>
      <div className='register'>
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="email" className="form-control" id="exampleInputEmail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required/>
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword" placeholder='password' required/>
          </div>
          <div className='d-flex'>
            <div className="mx-2">
              <button type="submit" className="btn btn-primary mb-1">Submit</button>
            </div>
            <div className="mx-1">
              <button type="submit" className="btn btn-primary" onClick={() => {navigate('/forgot-password')}}>Forgot Password</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default login