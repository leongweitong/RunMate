import React, {useState, useEffect} from 'react'
import Weather from '../components/Weather'
import { BsPlayFill } from 'react-icons/bs'

const HomePage = () => {
    const API_KEY = 'aa65f7513f5c6a1d66f50a855fe2632b'
    const lat = '2.306000'
    const lon = '102.317871'

    useEffect(() => {
        const getWeatherData = async () => {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
            const data = await res.json()
            console.log(data)
        }
        // getWeatherData()

        const getMotivationQuote = async () => {
            const res = await fetch(`https://api.api-ninjas.com/v1/quotes?category=fitness`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": "z1fGBOOa4vvKpYMMjJR7AA==gcinf1KSohU2jn5R"
                }
            })
            const data = await res.json()
            console.log(data)
        }
        // getMotivationQuote()
    }, [])

    return (
        <div>
            <Weather />
            <div className="mt-6 px-4">
                <div className='bg-white p-4 shadow'>
                    <h2 className='text-4xl font-bold'>"</h2>
                    <p className='text-xl italic font-bold'>The only bad run is the one that didn't happen."</p>
                    <p className='mt-2 font-bold opacity-70 text-lg italic'>- Don Norman</p>
                </div>
            </div>

            <div className='mt-4 px-4'>
                <button className='w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center text-lg'>
                <BsPlayFill className='mr-2' /> Start Run
                </button>
            </div>

            <div className='mt-6 bg-white p-4 rounded-lg shadow'>
                <h2 className='text-xl font-bold mb-2'>Recent Activity</h2>
                <div>
                <p>Distance: 5 km</p>
                <p>Duration: 25:30</p>
                <p>Pace: 5:06 /km</p>
                {/* Add a map or route image if available */}
                </div>
                <a href='/history' className='text-primary mt-2 block'>View All Runs</a>
            </div>

            <div className='mt-6 bg-white p-4 rounded-lg shadow'>
                <h2 className='text-xl font-bold mb-2'>Current Goals</h2>
                <p>Run 100 km in July</p>
                <div className='w-full bg-gray-200 h-2 rounded'>
                <div className='bg-primary h-2 rounded' style={{ width: '40%' }}></div>
                </div>
                <a href='/goals' className='text-primary mt-2 block'>View All Goals</a>
            </div>

            <div className='mt-6 bg-white p-4 rounded-lg shadow'>
                <h2 className='text-xl font-bold mb-2'>Upcoming Events</h2>
                <p>July Virtual 5K - Join Now!</p>
                <a href='/events' className='text-primary mt-2 block'>View All Events</a>
            </div>

            <div className='mt-6 bg-white p-4 rounded-lg shadow'>
                <h2 className='text-xl font-bold mb-2'>Weekly Stats</h2>
                <p>Total Distance: 30 km</p>
                <p>Average Pace: 5:15 /km</p>
                {/* Add graphs or charts if available */}
            </div>

            

            {/* Friends' Activities */}
            <div className='mt-6 bg-white p-4 rounded-lg shadow'>
                <h2 className='text-xl font-bold mb-2'>Friends' Activities</h2>
                <p>Jane Doe: 10 km run</p>
                <p>Mike Smith: 5 km run</p>
                <a href='/social' className='text-primary mt-2 block'>View All Activities</a>
            </div>
        </div>
    )
}

export default HomePage