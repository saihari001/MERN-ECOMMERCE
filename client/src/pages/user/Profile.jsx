import React, { useEffect,useState } from 'react'
import UserMenu from '../../components/UserMenu'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'

const Profile = () => {
    const [auth, setAuth] = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    //getUser
    useEffect(() => {
        const {name, email, password, phone, address} = auth?.user;
        setName(name);
        setEmail(email);
        setPassword(password);
        setPhone(phone);
        setAddress(address);
    }, [auth?.user])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            const {data} = await axios.put('/profile-update',{
                name,email,password,phone,address,
            });
            if(data?.error){
                toast.error(data?.error)
            }
            else{
                setAuth({...auth, user: data?.updatedUser})
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem("auth", JSON.stringify(ls))
                toast.success("Profile Updated Successfully")
            }
        }
        catch(error){
            console.log(error)
            toast.error("something went wrong")
        }
    }


  return (
    <Layout>
        <div className='container-fluid m-3 p-3'>
            <div className="row">
                <div className="col-md-3">
                    <UserMenu />
                </div>
                <div className='col-md-9'>
                    <h1>Update Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="exampleInputName" value={name} onChange={(e) => setName(e.target.value)} placeholder='name' />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="exampleInputEmail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required disabled/>
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword" placeholder='password' />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="exampleInputPhone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='phone' />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="exampleInputAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='address' />
                        </div>
                        <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Profile