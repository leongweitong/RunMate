import { useState } from 'react'
import Footer from './components/Footer'

function App() {

  return (
    <div className='flex'>
      <h1 className='bg-indigo-500'>
        RunMate Application
      </h1>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Footer />
    </div>
  )
}

export default App
