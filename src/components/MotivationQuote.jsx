import React, {useState, useEffect} from 'react'
import { SyncLoader } from 'react-spinners'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

const MotivationQuote = () => {
    const [loading, setLoading] = useState(false)
    const [color, setColor] = useState('rgba(230, 56, 37, 0.95)')
    const API_KEY = import.meta.env.VITE_NINJAS_API_KEY
    const API_URL = import.meta.env.VITE_NINJAS_API_URL
    const LOCAL_STORAGE_TIME = parseInt(import.meta.env.VITE_LOCAL_STORAGE_TIME, 10)
    const [motivationQuote, setMotivationQuote] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        const getMotivationQuote = async () => {
            try {
                setLoading(true);
                const categories = ['fitness', 'success', 'attitude'];
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const res = await fetch(`${API_URL}?category=${randomCategory}`, {
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

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="mt-6 px-4">
            <div className='bg-white p-4 shadow border-x-2 border-primary relative'>
                {loading && <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
                    <SyncLoader color={color} loading={loading} size={8} aria-label="Loading Spinner"/>
                </div>}
                {!loading && motivationQuote && (
                <>
                    <h2 className='text-2xl font-bold'>"</h2>
                    <p className='text-lg italic font-bold'>
                        {isExpanded ? motivationQuote.quote : `${motivationQuote.quote.substring(0, 100)} ${motivationQuote.quote.length > 100 ? '...' : ''}`} "
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                        <p className='font-bold opacity-70 italic'>- {motivationQuote.author}</p>
                        {motivationQuote.quote.length > 100 && (
                            <p>
                                {isExpanded ? (
                                    <BsChevronUp className='text-xl text-primary' onClick={handleToggle} />
                                ) : (
                                    <BsChevronDown className='text-xl text-primary' onClick={handleToggle} />
                                )}
                            </p>
                        )}
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default MotivationQuote