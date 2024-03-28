import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DropIn from 'braintree-web-drop-in-react'


const CartPage = () => {
    const [cart, setCart] = useCart()
    const [auth, setAuth] = useAuth()
    const [clientToken, setClientToken] = useState("")
    const [instance, setInstance] = useState("")
    const [loading, setLoading] = useState("")
    const navigate = useNavigate()

    //total
    const totalPrice = () => {
        try{
            let total = 0;
            cart?.map((item) => {
                total = total + item.price;
            })
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "INR"
            })
        }
        catch(error){
            console.log(error)
        }
    }

    //delete cart item
    const removeCartItem = (pid) => {
        try{
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart))
        }
        catch(error){
            console.log(error)
        }
    }

    //get payment gateway token
    const getToken = async() => {
        try{
            const {data} = await axios.get('/product/braintree/token')
            setClientToken(data?.clientToken)
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getToken()
    }, [auth?.token])

    //handlePayment
    const handlePayment = async() => {
        try{
            const {nonce} = await instance.requestPaymentMethod()
            const {data} = await axios.post('/product/braintree/payment',{
                nonce, cart,
            })
            setLoading(false)
            localStorage.removeItem('cart')
            setCart([])
            navigate('/dashboard/user/order')
            toast.success("Order Successfully Placed")
        }
        catch(error){
            console.log(error)
            setLoading(false)
        }
    }
  return (
    <Layout title='Cart - Unknown Brand'>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className='text-center bg-light p-2'>
                        {`Hello ${auth?.token && auth?.user?.name}`}
                    </h1>
                    <h4 className='text-center'>
                        {cart?.length >= 1 ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "pls login to checkout"}` : "Your cart is empty"}
                    </h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    {cart?.map((c) => (
                        <div className="row mb-2 p-3 card flex-row">
                            <div className="col-md-4">
                                <img src={`https://mern-ecommerce-backend-34bh.onrender.com/product/get-product/photo/${c._id}`} width="100px" height="100px" className='card-img-top' alt={c.name} />
                            </div>
                            <div className="col-md-8">
                                <p>{c.name}</p>
                                <p>{c.description.substring(0,10)}...</p>
                                <p>Price: Rs {c.price}</p>
                                <button className='btn btn-danger' onClick={() => removeCartItem(c._id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-md-4 text-center">
                    <h2>Cart Summary</h2>
                    <p>Total | Checkout | Payment</p>
                    <hr />
                    <h4>Total: {totalPrice()}</h4>
                    {auth?.user?.address ? (
                        <>
                            <div className='mb-3'>
                                <h4>Current Address</h4>
                                <h5>{auth?.user?.address}</h5>
                                <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                            </div>
                        </>
                    ) : (
                        <div className='mb-3'>
                            {
                                auth?.token ? (
                                    <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                ) : (
                                    <button className='btn btn-outline-warning' onClick={() => navigate('/login', {state: '/cart',})}>Pls Login to continue</button>
                                )
                            }
                        </div>   
                    )}
                    <div className="mt-2">
                        {!clientToken || !cart.length ? (
                            ""
                        ) : (
                            <>
                                <DropIn 
                                    options={{authorization: clientToken, paypal: {flow: 'vault'}}}
                                    onInstance={(instance) => setInstance(instance)}
                                />
                                <button className='btn btn-success' type='submit' onClick={handlePayment} disabled={ !loading || !instance || !auth?.user?.address}>
                                    {loading ? "Processing...." : "Make Payment"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CartPage