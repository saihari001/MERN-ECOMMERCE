import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
      <h4>All Right Reserved &copy; codewithhari</h4>
      <Link to='/about'>About</Link>|<Link to='/contact'>Contact</Link>|<Link to='/policy'>Policy</Link>
    </div>
  )
}

export default Footer