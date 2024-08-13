import React, {useState, useEffect, useRef} from 'react'
import { BsPauseFill, BsStopFill, BsCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { useIndexedDB } from "react-indexed-db-hook";

const RunningControls = ({keepTrack, handleChangeKeepTrack, totalDistance, path}) => {
    const { add } = useIndexedDB("activity");
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (keepTrack) {
            timerRef.current = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1000);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [keepTrack]);

    const togglePlayPause = () => {
        handleChangeKeepTrack(!keepTrack);
        
        if (!keepTrack) {
            setElapsedTime(elapsedTime);
        } else {
            clearInterval(timerRef.current);
        }
    };

    const endRunning = () => {
        if(!keepTrack && totalDistance === 0) {
            clearInterval(timerRef.current);
            navigate('/')
            return
        }

        const userConfirmed = window.confirm('Are you sure you want to store this activity?');
        if (userConfirmed && keepTrack) {
            add({type: 'running', time: elapsedTime, totalDistance, path}).then(
                (event) => {
                    console.log("Activity ID Generated: ", event);
                },
                (error) => {
                    console.error("Error adding activity: ", error);
                }
            );
        }

        clearInterval(timerRef.current);
        navigate('/');
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
                    {t("general.duration")}: <span className='font-bold'>{formatTime(elapsedTime)}</span>
                    </div>
                    <div>{t("general.kilometers")}: <span className='font-bold'>{totalDistance.toFixed(0)} M</span></div>
                </div>
                <div className="flex gap-6">
                    <div className='rounded-full bg-white p-2' onClick={togglePlayPause}>
                        {keepTrack ? (
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