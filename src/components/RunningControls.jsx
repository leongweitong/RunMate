import React, {useState, useEffect, useRef} from 'react'
import { BsPauseFill, BsStopFill, BsCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { useIndexedDB } from "react-indexed-db-hook";
import { getGoalsByStatus } from '../indexedDBUtils';
import {formatTime} from '../utils/formatTime'

const RunningControls = ({keepTrack, handleChangeKeepTrack, totalDistance, path}) => {
    const { add } = useIndexedDB("activity");
    const { update } = useIndexedDB("goal");
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

    const handleOnGoingGoals = async (totalDistance) => {
        try {
            // Fetch ongoing goals (status = '0')
            const ongoingGoals = await getGoalsByStatus('0');
            
            // Filter goals by type 'running'
            const runningGoals = ongoingGoals.filter(goal => goal.type === 'running');
    
            // Update goals with new distance
            runningGoals.forEach(goal => {
                // Add the distance from the activity
                goal.currentDistance += totalDistance;
    
                // Check if the goal is complete
                if (goal.currentDistance >= goal.totalDistance) {
                    // If the goal is complete, update the status to '1' (completed)
                    goal.status = '1';
                }

                update({ id: goal.id, status: goal.status, currentDistance: goal.currentDistance, totalDistance: goal.totalDistance, endTime: goal.endTime, name: goal.name }).then((event) => {
                    console.log(`Goal ${goal.name} updated!`);
                  });
            });
    
        } catch (error) {
            console.error('Error updating ongoing goals:', error);
        }
    };    

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
            handleOnGoingGoals()
        }

        clearInterval(timerRef.current);
        navigate('/');
    }

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