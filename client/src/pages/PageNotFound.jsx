import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <Layout title='Page Not Found - Unknown Brand'>
      <div className='pnf'>
        <h1 className='pnf-status'>404</h1>
        <h2 className='pnf-error'>Page Not Found</h2>
        <Link to='/' className='pnf-btn'>Back</Link>
      </div>
    </Layout>
  )
}

export default PageNotFound