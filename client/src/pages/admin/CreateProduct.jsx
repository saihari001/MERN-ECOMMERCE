import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import AdminMenu from '../../components/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Select } from 'antd'
const {Option} = Select


const CreateProduct = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [shipping, setShipping] = useState("")
  const [photo, setPhoto] = useState("")
  const [category, setCategory] = useState([])


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

    const handleCreate = async(e) => {
      e.preventDefault()
      try{

        const productData = new FormData()
        productData.append("name", name)
        productData.append("description", description)
        productData.append("price", price)
        productData.append("quantity", quantity)
        productData.append("photo", photo)
        productData.append("category", category)

        const {data} = await axios.post('/product/add-product', productData)
        if(data?.success){
          toast.success(`${name} created successfully`)
        }
        else{
          toast.error(data?.message)
        }
      }
      catch(error){
        console.log(error)
        toast.error("Something went wrong")
      }
    }
  return (
    <Layout>
    <div className='container-fluid m-3 p-3'>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className='col-md-9'>
          <h1>Create Product</h1>
          <div className='m-1 w-75'>
            <Select placeholder='select a category' size='large' showSearch className='form-select mb-3' onChange={(value) => {setCategory(value)}}>
            {categories?.map(c => (
              <Option key={c._id} value={c._id}>{c.name}</Option>
            ))}
            </Select>
            <div className='mb-3'>
              <label className='btn btn-outline-secondary'>
                {photo ? photo.name : "Upload Photos"}
                <input type="file" name="photo" accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden/>
              </label>
            </div>
            <div className='mb-3'>
              {photo && (
                <div className='text-center'>
                  <img src={URL.createObjectURL(photo)} alt="product photo" height={"100px"} className='img img-responsive'/>
                </div>
              )}
            </div>
            <div className='mb-3'>
              <input type="text" value={name} placeholder='enter a product name' className='form-control' onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mb-3'>
              <input type="text" value={description} placeholder='enter a product description' className='form-control' onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className='mb-3'>
              <input type="number" value={price} placeholder='enter a product price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className='mb-3'>
              <input type="number" value={quantity} placeholder='enter a product quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className='mb-3'>
                <Select placeholder='select shipping' size='large' showSearch className='form-select mb-3' onChange={(value) => {setShipping(value);}}>
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
            </div>
            <div className="mb-3">
              <button className='btn btn-primary' onClick={handleCreate}>Create Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default CreateProduct