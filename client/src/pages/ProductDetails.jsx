import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'

const ProductDetails = () => {
    const [product,setProduct] = useState({})
    const params = useParams()

    useEffect(() => {
        if(params?.slug) getProduct()
    }, [params?.slug])

    const getProduct = async() => {
        try{
            const {data} = await axios.get(`/product/get-product/${params.slug}`)
            setProduct(data?.product)
        }
        catch(error){
            console.log(error)
        }
    }
  return (
    <Layout>
        <div className='row container mt-2'>
            <div className='col-md-5'>
            <img src={`http://localhost:8000/product/get-product/photo/${product._id}/`} className='card-img-top' alt={product.name} height="400" width={"850px"}/>
            </div>
            <div className='col-md-4 p-2 g-2'>
                <h1 className='text-center'>Product Details</h1>
                <h6>Name: {product.name}</h6>
                <h6>Description {product.description}</h6>
                <h6>Price: {product.price}</h6>
                <button className='btn btn-warning ms-1'>ADD TO CART</button>
            </div>
        </div>
    </Layout>
  )
}

export default ProductDetails