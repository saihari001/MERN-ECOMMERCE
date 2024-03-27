import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'

const Layout = ({children}) => {
  return (
    <div>
      <Header />
      <main className='layout'>
        <Toaster position='top-center' toastOptions={{duration: 6000}}/>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout