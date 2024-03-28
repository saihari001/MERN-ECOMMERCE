import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'
import { Helmet } from 'react-helmet'

const Layout = ({children, description, keywords, author, title}) => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8'/>
        <meta name='description' content={description}/>
        <meta name='keywords' content={keywords}/>
        <meta name='author' content={author}/>
        <title>{title}</title>
      </Helmet>
      <Header />
      <main className='layout'>
        <Toaster position='top-center' toastOptions={{duration: 6000}}/>
        {children}
      </main>
      <Footer />
    </div>
  )
}

Layout.defaultProps = {
  title: 'Unknown Brand',
  description: 'MERN Stack Project',
  keywords: 'MERN, REACT, NODE, MONGODB',
  author: 'CodewithHari'
}
export default Layout