import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import AdminMenu from '../../components/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Select } from 'antd'
const {Option} = Select

const UpdateProduct = () => {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")
    const [photo, setPhoto] = useState("")
    const [category, setCategory] = useState([])
    const [id, setId] = useState("")
    const params = useParams()
    const navigate = useNavigate()

    //get single product
    const getSingleProduct = async () => {
        try{
            const {data} = await axios.get(`/product/get-product/${params.slug}`)
            setName(data.product.name)
            setId(data.product._id)
            setDescription(data.product.description)
            setPrice(data.product.price)
            setQuantity(data.product.quantity)
            setCategory(data.product.category._id)
            setShipping(data.product.shipping)
        }
        catch(error){
          console.log(error)
          toast.error(data.message)
        }
      }
      useEffect(() => {
        getSingleProduct()
      }, [])

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
  
      const handleUpdate = async(e) => {
        e.preventDefault()
        try{
          const productData = new FormData();
          productData.append("name", name);
          productData.append("description", description);
          productData.append("price", price);
          productData.append("quantity", quantity);
          photo && productData.append("photo", photo);
          productData.append("category", category);

          const {data} = await axios.put(`/product/update-product/${id}`, productData)
          if(data?.success){
            toast.success(`${name} updated successfully`)
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
      const handleDelete = async() => {
        try{
          let confirm = window.prompt('Are you sure you want to delete this product, type "yes" ?')
          if(confirm === 'yes'){
            const {data} = await axios.delete(`/product/delete-product/${id}`)
            toast.success("deleted successfully")
            navigate('/dashboard/admin/products')
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
          <h1>Edit Product</h1>
          <div className='m-1 w-75'>
            <Select placeholder='select a category' size='large' showSearch className='form-select mb-3'
            onChange={(value) => {setCategory(value)}} value={category}>
            {categories?.map((c) => (
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
              {photo ? (
                <div className='text-center'>
                  <img src={URL.createObjectURL(photo)} alt="product photo" height={"100px"} className='img img-responsive' />
                </div>
              ) : (
                <div className='text-center'>
                  <img src={`https://mern-ecommerce-backend-34bh.onrender.com/product/get-product/photo/${id}`} alt="product photo" height={"100px"} className='img img-responsive' />
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
                <Select placeholder='select shipping' size='large' showSearch className='form-select mb-3' onChange={(value) => {setShipping(value);}} value={shipping ? "Yes" : "No"}>
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
            </div>
            <div className="mb-3">
              <button className='btn btn-primary' onClick={handleUpdate}>Update Product</button>
            </div>
            <div className="mb-3">
              <button className='btn btn-danger' onClick={handleDelete}>Delete Product</button>
            </div>
          </div>
        </div>
      </div>
    </div> 
    </Layout>
  )
}

export default UpdateProduct