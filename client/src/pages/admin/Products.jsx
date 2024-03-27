import Layout from '../../components/Layout'
import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Products = () => {
    const [products, setProducts] = useState([])

    //get Products
    const getProducts = async () => {
        try{
            const {data} = await axios.get('/product/get-product')
            if(data.success){
              setProducts(data.product);
            }
          }
          catch(error){
            console.log(error)
            toast.error("something went wrong in fetching products")
          }
        }
        useEffect(() => {
            getProducts();
        }, [])

  return (
    <Layout>
    <div className='container-fluid m-3 p-3'>
        <div className='row'>
            <div className="col-md-3">
                <AdminMenu />
            </div>
            <div className="col-md-9">
                <h1 className="text-center">All Product List</h1>
                {products?.map((p) => (
                    <>
                        <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className='product-link'>
                        <div className='card m-2' style={{ width: "18rem" }}>
                        <img src={`http://localhost:8000/product/get-product/photo/${p._id}/`} className='card-img-top' alt={p.name} />
                        <div className='card-body'>
                            <h5 className='card-title'>{p.name}</h5>
                            <p className='card-text'>{p.description}</p>
                        </div>
                    </div>   
                    </Link>
                    </>
                ))}
            </div>
        </div>
    </div>
    </Layout>
  )
}

export default Products