import React, {useState, useEffect} from 'react'

const MoticationQuote = () => {
  const API_KEY = import.meta.env.VITE_NINJAS_API_KEY
  const API_URL = import.meta.env.VITE_NINJAS_API_URL
  const [moticationQuote, setMotivationQuote] = useState(null)

  useEffect(() => {
    const getMotivationQuote = async () => {
        const res = await fetch(`${API_URL}?category=fitness`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": API_KEY
            }
          })
          const data = await res.json()
          setMotivationQuote(data[0])
          console.log(data[0])
      }
      getMotivationQuote()
  }, [])

  if (!moticationQuote) return null

  return (
    <div className="mt-24 px-4">
        <div className='bg-white p-4 shadow border-x-2 border-primary'>
            <h2 className='text-4xl font-bold'>"</h2>
            <p className='text-lg italic font-bold'>{moticationQuote.quote}"</p>
            <p className='mt-2 font-bold opacity-70 text-md italic'>- {moticationQuote.author}</p>
        </div>
    </div>
  )
}

export default MoticationQuote