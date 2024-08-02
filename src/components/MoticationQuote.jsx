import React, {useState, useEffect} from 'react'
import { SyncLoader } from 'react-spinners'

const MoticationQuote = () => {
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState('rgba(230, 56, 37, 0.95)')
  const API_KEY = import.meta.env.VITE_NINJAS_API_KEY
  const API_URL = import.meta.env.VITE_NINJAS_API_URL
  const LOCAL_STORAGE_TIME = parseInt(import.meta.env.VITE_LOCAL_STORAGE_TIME, 10)
  const [moticationQuote, setMotivationQuote] = useState(null)

  useEffect(() => {
    const getMotivationQuote = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}?category=fitness`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': API_KEY,
                },
            });
            const data = await res.json();
            setMotivationQuote(data[0]);
            const quoteCache = {
                data: data[0],
                timestamp: new Date().getTime(),
            };
            localStorage.setItem('quote', JSON.stringify(quoteCache));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMotivationQuote = () => {
        const cachedQuote = localStorage.getItem('quote');
        if (cachedQuote) {
            const quoteCache = JSON.parse(cachedQuote);
            const currentTime = new Date().getTime();

            if (currentTime - quoteCache.timestamp < LOCAL_STORAGE_TIME) {
                setMotivationQuote(quoteCache.data);
                return;
            }
        }
        getMotivationQuote();
    };

    fetchMotivationQuote();
}, [])

  return (
    <div className="mt-6 px-4">
        <div className='bg-white p-4 shadow border-x-2 border-primary relative'>
            {loading && <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
                <SyncLoader color={color} loading={loading} size={8} aria-label="Loading Spinner"/>
            </div>}
            {!loading && moticationQuote && (
              <>
              <h2 className='text-2xl font-bold'>"</h2>
              <p className='text-lg italic font-bold'>{moticationQuote.quote}"</p>
              <p className='mt-2 font-bold opacity-70 italic'>- {moticationQuote.author}</p>
              </>
            )}
        </div>
    </div>
  )
}

export default MoticationQuote