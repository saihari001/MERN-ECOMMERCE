import React, { useState } from 'react'
import {useSearch} from '../../context/Search'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SearchInput = () => {
    const [values, setValues] = useSearch()
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            const {data} = await axios.get(`product/search/${values}`)
            setValues({...values, results: data})
            navigate('/search')
        }
        catch(error){
            console.log(error)
        }
    }
  return (
    <div>
        <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input className="form-control me-2" value={values.keyword} onChange={(e) => setValues(e.target.value)} type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
    </div>
  )
}

export default SearchInput