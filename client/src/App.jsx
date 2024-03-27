import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import Policy from './pages/Policy'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import {Routes, Route} from 'react-router-dom'
import axios from 'axios'
import Dashboard from './pages/user/Dashboard'
import Private from './components/routes/Private'
import ForgotPassword from './pages/auth/ForgotPassword'
import Admin from './components/routes/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateProduct from './pages/admin/CreateProduct'
import CreateCategory from './pages/admin/CreateCategory'
import Users from './pages/admin/Users'
import Orders from './pages/user/Orders'
import Profile from './pages/user/Profile'
import Products from './pages/admin/Products'
import UpdateProduct from './pages/admin/UpdateProduct'
import SearchBox from './pages/SearchBox'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'


axios.defaults.baseURL='https://mern-ecommerce-backend-34bh.onrender.com'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/product/:slug' element={<ProductDetails />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/search' element={<SearchBox />} />
        <Route path='/dashboard' element={<Private/>} >
          <Route path='user' element={<Dashboard />} />
          <Route path='user/profile' element={<Profile />} />
          <Route path='user/orders' element={<Orders />} />
        </Route>
        <Route path='/dashboard' element={<Admin/>} >
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-category' element={<CreateCategory />} />
          <Route path='admin/create-product' element={<CreateProduct />} />
          <Route path='admin/products' element={<Products />} />
          <Route path='admin/product/:slug' element={<UpdateProduct />} />
          <Route path='admin/users' element={<Users />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/policy' element={<Policy />} />
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App
