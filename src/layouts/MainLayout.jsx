import React from 'react'
import { Outlet } from "react-router-dom";
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <>
        <div className='pb-16'>
            <Outlet />
        </div>
        <Footer />
    </>
  )
}

export default MainLayout