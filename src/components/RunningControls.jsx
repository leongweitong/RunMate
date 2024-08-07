import React, {useState, useEffect, useRef} from 'react'
import { BsPauseFill, BsStopFill, BsCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const RunningControls = () => {
    const navigate = useNavigate()
    const [isPlaying, setIsPlaying] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1000);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying((prevState) => !prevState);
        if (!isPlaying) {
            setElapsedTime(elapsedTime);
        } else {
            console.lo
            clearInterval(timerRef.current);
        }
    };

    const endRunning = () => {
        clearInterval(timerRef.current);
        navigate('/')
        return
    }

    const formatTime = (time) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-10 left-0 w-full p-4 text-white z-10">
            <div className="bg-black p-4 flex justify-between items-center rounded-xl">
                <div>
                    <div>
                        Duration: <span className='font-bold'>{formatTime(elapsedTime)}</span>
                    </div>
                    <div>Kilometers: <span className='font-bold'>0.0 KM</span></div>
                </div>
                <div className="flex gap-6">
                    <div className='rounded-full bg-white p-2' onClick={togglePlayPause}>
                        {isPlaying ? (
                        <BsPauseFill className='text-4xl text-primary' />
                        ) : (
                        <BsCaretRightFill className='text-4xl text-primary' />
                        )}
                    </div>
                    <div className='rounded-full bg-white p-2' onClick={endRunning}>
                        <BsStopFill className='text-4xl text-primary' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RunningControls