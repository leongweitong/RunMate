import React, {useState, useEffect} from 'react'

const MoticationQuote = ({setLoading}) => {
  const API_KEY = import.meta.env.VITE_NINJAS_API_KEY
  const API_URL = import.meta.env.VITE_NINJAS_API_URL
  const [moticationQuote, setMotivationQuote] = useState(null)

  useEffect(() => {
    const getMotivationQuote = async () => {
      try{
        setLoading(true)
        const res = await fetch(`${API_URL}?category=fitness`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "X-Api-Key": API_KEY
          }
        })
        const data = await res.json()
        setMotivationQuote(data[0])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
      getMotivationQuote()
  }, [])

  if (!moticationQuote) return null

  return (
    <div className="mt-6 px-4">
        <div className='bg-white p-4 shadow border-x-2 border-primary'>
            <h2 className='text-2xl font-bold'>"</h2>
            <p className='text-lg italic font-bold'>{moticationQuote.quote}"</p>
            <p className='mt-2 font-bold opacity-70 italic'>- {moticationQuote.author}</p>
        </div>
    </div>
  )
}

export default MoticationQuote