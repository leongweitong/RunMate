import { useState } from 'react'
import Footer from './components/Footer'
import { BsPlayFill } from 'react-icons/bs'

function App() {

  return (
    <div className='p-4'>
      {/* Welcome Message */}
      <h1 className='text-2xl font-bold'>Welcome back, John!</h1>
      
      {/* Quick Start Run */}
      <div className='mt-4'>
        <button className='w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center text-lg'>
          <BsPlayFill className='mr-2' /> Start Run
        </button>
      </div>

      {/* Recent Activity */}
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

      {/* Current Goals */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-2'>Current Goals</h2>
        <p>Run 100 km in July</p>
        <div className='w-full bg-gray-200 h-2 rounded'>
          <div className='bg-primary h-2 rounded' style={{ width: '40%' }}></div>
        </div>
        <a href='/goals' className='text-primary mt-2 block'>View All Goals</a>
      </div>

      {/* Upcoming Events/Challenges */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-2'>Upcoming Events</h2>
        <p>July Virtual 5K - Join Now!</p>
        <a href='/events' className='text-primary mt-2 block'>View All Events</a>
      </div>

      {/* Daily/Weekly Stats */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-2'>Weekly Stats</h2>
        <p>Total Distance: 30 km</p>
        <p>Average Pace: 5:15 /km</p>
        {/* Add graphs or charts if available */}
      </div>

      {/* Motivational Quotes/Tips */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-2'>Motivational Quote</h2>
        <p>"The only bad run is the one that didn't happen."</p>
      </div>

      {/* Weather Information */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-2'>Weather</h2>
        <p>Current: 22°C, Sunny</p>
        <p>Forecast: Clear skies all day</p>
      </div>

      {/* Friends' Activities */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-2'>Friends' Activities</h2>
        <p>Jane Doe: 10 km run</p>
        <p>Mike Smith: 5 km run</p>
        <a href='/social' className='text-primary mt-2 block'>View All Activities</a>
      </div>
      <Footer />
    </div>
  )
}

export default App
