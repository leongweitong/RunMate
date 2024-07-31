import React from 'react'
import { Outlet } from "react-router-dom";
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <>
        <Outlet />
        <Footer />
    </>
  )
}

export default MainLayout