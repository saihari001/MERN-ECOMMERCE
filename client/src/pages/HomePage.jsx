import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import {Checkbox, Radio} from 'antd'
import { Prices } from '../components/Prices'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const HomePage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [cart, setCart] = useCart()



    //get all category
    const getAllCategory = async () => {
      try{
        const {data} = await axios.get('/category/get-category')
        if(data?.success){
          setCategories(data?.category);
        }
      }
      catch(error){
        console.log(error)
        toast.error("something went wrong in fetching category")
      }
    }
    useEffect(() => {
      getAllCategory()
    }, [])

  //get all products
  const getAllProducts = async() => {
    try{
      const {data} = await axios.get('/product/get-product')
      setProducts(data?.product)
    }
    catch(err){
      console.log(error)
    }
  }
  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts()
  }, [checked.length, radio.length])

  useEffect(() => {
    if(checked.length || radio.length) getProductByFilter();
  }, [checked, radio])

  //get filtered
  const getProductByFilter = async () => {
    try{
      const {data} = await axios.post('/product/product-filters',{checked, radio})
      setProducts(data?.product)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleFilter = (value, id) => {
    let all = [...checked]
    if(value){
      all.push(id)
    }
    else{
      all = all.filter((c) => c!== id)
    }
    setChecked(all)
  }
  return (
    <Layout title='Home - Unknown Brand'>
      <div className='container-fluid row mt-3'>
        <div className="col-md-3">
          <h4 className='text-center'>Filters by Category</h4>
          <div className='d-flex flex-column'>
            {categories.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/*Price filter*/}
          <h4 className='text-center mt-4'>Filters by Price</h4>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map(p => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          </div>
          <div className="col-md-9">
            <h1 className='text-center'>All Products</h1>
            <div className='d-flex flex-wrap'>
              {products?.map((p) => (
                <>
                  <div className='card m-2' style={{ width: "18rem" }}>
                    <img src={`https://mern-ecommerce-backend-34bh.onrender.com/product/get-product/photo/${p._id}/`} width="100px" height="200px" className='card-img-top' alt={p.name} />
                    <div className='card-body'>
                      <h5 className='card-title'>{p.name}</h5>
                      <p className='card-text'>{p.description.substring(0,30)}...</p>
                      <p className='card-text'>Rs {p.price}</p>
                      <button className='btn btn-warning ms-1' onClick={() => {setCart([...cart, p]); toast.success("Item added to cart"); localStorage.setItem('cart', JSON.stringify([...cart, p]))}}>ADD TO CART</button>
                      <button className='btn btn-primary ms-1' onClick={() => navigate(`/product/${p.slug}`)}>See Details</button>
                    </div>
                  </div>   
                </>
              ))}
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default HomePage