import React from 'react'
import { BsHouse, BsList, BsBarChart, BsFlag } from 'react-icons/bs'

const Footer = () => {
  return (
    <footer className='fixed bottom-0 inset-x-0 border-t border-secondary bg-white'>
        <div className='container px-4 py-3'>
            <div className='flex justify-around'>
                <BsHouse className='text-3xl text-primary' />
                <BsBarChart className='text-3xl' />
                <BsFlag className='text-3xl' />
                <BsList className='text-3xl' />
            </div>
        </div>
    </footer>
  )
}

export default Footer