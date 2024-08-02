import React, {useState, useEffect} from 'react'
import Weather from '../components/Weather'
import MoticationQuote from '../components/MoticationQuote'
import { BsPlayFill } from 'react-icons/bs'

const HomePage = () => {
    return (
        <div>
            <Weather />
            <MoticationQuote />

            <div className='mt-6 px-4'>
                <button className='w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center text-lg'>
                    <BsPlayFill className='mr-2' /> Start Run
                </button>
            </div>

            <div className='mt-6 px-4'>
                <div className='flex justify-between mb-2'>
                    <div className='font-bold'>Current Goals</div>
                    <div className='underline underline-offset-2 text-primary'>See all</div>
                </div>
                <div className='bg-white rounded-lg shadow p-4'>
                    <p className='mb-1 font-bold opacity-80'>Run 100 km in July</p>
                    <div className='w-full bg-gray-200 h-3 rounded'>
                        <div className='bg-primary h-3 rounded' style={{ width: '40%' }}></div>
                    </div>
                </div>
            </div>

            <div className='mt-6 px-4'>
                <div className='flex justify-between mb-2'>
                    <div className='font-bold'>Recent Activity</div>
                    <div className='underline underline-offset-2 text-primary'>See all</div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow flex items-center gap-2 mb-2'>
                    <img src="/runmateIcon.png" alt="runmate-image" className='h-16 w-16 rounded-xl' />
                    <div>
                        <p className='font-bold opacity-80'>Running - 02-08-2024</p>
                        <p className='font-bold text-xl'>5.35 Km</p>
                        <p>00-25-20</p>
                    </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow flex items-center gap-2'>
                    <img src="/runmateIcon.png" alt="runmate-image" className='h-16 w-16 rounded-xl' />
                    <div>
                        <p className='font-bold opacity-80'>Running - 02-08-2024</p>
                        <p className='font-bold text-xl'>5.35 Km</p>
                        <p>00-25-20</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage