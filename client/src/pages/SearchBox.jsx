import React from 'react'
import { useSearch } from '../context/Search'
import Layout from '../components/Layout'

const SearchBox = () => {
    const [values, setValues] = useSearch()
  return (
    <div>
        <Layout>
            <div className="container">
                <div className="text-center">
                    <h1>Search Result</h1>
                    <h6>{values?.results.length < 1 ? 'No Product Found' : `Found ${values?.results.length}`}</h6>
                    <div className='d-flex flex-wrap'>
              {values?.results.map((p) => (
                <>
                  <div className='card m-2' style={{ width: "18rem" }}>
                    <img src={`http://localhost:8000/product/get-product/photo/${p._id}/`} width="100px" height="200px" className='card-img-top' alt={p.name} />
                    <div className='card-body'>
                      <h5 className='card-title'>{p.name}</h5>
                      <p className='card-text'>{p.description.substring(0,30)}...</p>
                      <p className='card-text'>Rs {p.price}</p>
                      <button className='btn btn-warning ms-1'>ADD TO CART</button>
                      <button className='btn btn-primary ms-1'>See Details</button>
                    </div>
                  </div>   
                </>
              ))}
            </div>
                </div>
            </div>
        </Layout>
    </div>
  )
}

export default SearchBox