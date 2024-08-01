import React from 'react'
import { BsHouse, BsList, BsBarChart, BsFlag } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='fixed bottom-0 inset-x-0 border-t border-secondary bg-white'>
        <div className='container px-4 py-3'>
            <div className='flex justify-around'>
                <NavLink to="/" className={({isActive}) => isActive ? 'text-primary' : ''}>
                  <BsHouse className='text-3xl' />
                </NavLink>
                <NavLink to="/analysis" className={({isActive}) => isActive ? 'text-primary' : ''}>
                  <BsBarChart className='text-3xl' />
                </NavLink>
                <NavLink to="/goal" className={({isActive}) => isActive ? 'text-primary' : ''}>
                  <BsFlag className='text-3xl' />
                </NavLink>
                <NavLink to="/menu" className={({isActive}) => isActive ? 'text-primary' : ''}>
                  <BsList className='text-3xl' />
                </NavLink>
            </div>
        </div>
    </footer>
  )
}

export default Footer