import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import AdminMenu from '../../components/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import CategoryForm from '../../components/form/CategoryForm'
import {Modal} from 'antd'
import 'antd/dist/reset.css'

const CreateCategory = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatedName, setUpdatedName] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const {data} = await axios.post('/category/create-category', {name})
      if(data?.success){
        toast.success(`${name} is created successfully`)
        getAllCategory();
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      console.log(error)
      toast.error("something went wrong in adding category form")
    }
  }
  //get all category
  const getAllCategory = async () => {
    try{
      const {data} = await axios.get('/category/get-category')
      if(data.success){
        setCategories(data.category);
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
      const {data} = await axios.put(`category/update-category/${selected._id}`, {name: updatedName})
      if(data.success){
        toast.success(`${updatedName} is successfully updated`)
        setSelected(null)
        setUpdatedName("")
        setVisible(false)
        getAllCategory()
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  const handleDelete = async(pid) => {
    try{
      const {data} = await axios.delete(`category/delete-category/${pid}`)
      if(data.success){
        toast.success('successfully deleted')
        getAllCategory()
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  return (
    <Layout title='Category - Unknown Brand'>
    <div className='container-fluid m-3 p-3'>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className='col-md-9'>
          <h1>Manage Category</h1>
          <div className='w-50 p-3'>
            <CategoryForm value={name} handleSubmit={handleSubmit} setValue={setName}/>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((c) => (
                  <>
                    <tr>
                      <td key={c._id}>{c.name}</td>
                      <td><button className='btn btn-primary ms-2' onClick={() => {setVisible(true) ; setUpdatedName(c.name) ; setSelected(c)}}>Edit</button></td>
                      <td><button className='btn btn-danger ms-2' onClick={() => handleDelete(c._id)}>Delete</button></td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <Modal onCancel={() => setVisible(false)} footer={null}>
            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
          </Modal>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default CreateCategory