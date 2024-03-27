import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../Spinner'
const Private = () => {
    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth()
    useEffect(() => {
        const autoCheck = async () => {
            const res = await axios.get('/user-auth', 
            {
                headers: {
                    "Authorization":auth?.token
                }
            })
            if(res.data.ok){
                setOk(true)
            }
            else{
                setOk(false)
            }
        }
        if(auth?.token) autoCheck()
    }, [auth?.token])
  return ok ? <Outlet /> : <Spinner />
}

export default Private