import React, {useState, useEffect, useRef} from 'react'
import { BsPauseFill, BsStopFill, BsCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { useIndexedDB } from "react-indexed-db-hook";
import { getGoalsByStatus } from '../indexedDBUtils';
import {formatTime} from '../utils/formatTime';
import AlertBox from '../components/AlertBox';

const RunningControls = ({keepTrack, handleChangeKeepTrack, totalDistance, path, multiPath, coords}) => {
    const { add } = useIndexedDB("activity");
    const { update } = useIndexedDB("goal");
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const distance = Number((totalDistance / 1000).toFixed(2))
    const [showAlertBox, setShowAlertBox] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleAlertBox = (text) => {
        setAlertMessage(text);
        setShowAlertBox(true);
    };

    useEffect(() => {
        if (window.cordova) {
            cordova.plugins.backgroundMode.enable();
            cordova.plugins.backgroundMode.setDefaults({ silent: true });
    
            cordova.plugins.backgroundMode.on('activate', () => {
                cordova.plugins.backgroundMode.disableWebViewOptimizations();
                // cordova.plugins.backgroundMode.setDefaults({
                //     title: "RunMate",
                //     text: "Tracking your run in the background",
                //     icon: 'icon',
                // });
            });
    
            cordova.plugins.backgroundMode.on('failure', () => {
                handleAlertBox(t("quote.alert.avoid-lock-screen"));
            });
        }
    
        return () => {
            if (window.cordova) {
                cordova.plugins.backgroundMode.disable();
            }
        };
    }, []);

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

    const handleOnGoingGoals = async () => {
        try {
            const ongoingGoals = await getGoalsByStatus('0');
            
            const runningGoals = ongoingGoals.filter(goal => goal.type === 'running');
    
            // Update goals with new distance
            for (const goal of runningGoals) {
                const currentDistance = Number(goal.currentDistance) || 0;
                const newDistance = currentDistance + distance;
    
                if (newDistance >= goal.totalDistance) goal.status = '1';
    
                // Update the goal in IndexedDB
                await update({
                    id: goal.id,
                    status: goal.status,
                    currentDistance: newDistance,
                    totalDistance: Number(goal.totalDistance),
                    name: goal.name,
                    endTime: goal.endTime,
                    type: goal.type
                });
    
                console.log(`Goal ${goal.name} updated!`);
            }
            
            clearInterval(timerRef.current);
            navigate('/');
    
        } catch (error) {
            console.error('Error updating ongoing goals:', error);
            handleAlertBox(t("quote.alert.cannot-update-goals"));
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

        if (totalDistance === 0) {
            handleAlertBox(t("quote.alert.cannot-save-activity"));
            clearInterval(timerRef.current);
            navigate('/');
            return;
        }

        const userConfirmed = window.confirm('Are you sure you want to end this activity?');
        if (userConfirmed && totalDistance > 0) {
            const createTime = new Date().toISOString();
            const finalPath = JSON.parse(JSON.stringify(multiPath));
            path.length > 0 && finalPath.push(path);
            add({type: 'running', time: elapsedTime, totalDistance: distance, path: finalPath, coords, createTime}).then(
                (event) => {
                    console.log("Activity ID Generated: ", event);
                },
                (error) => {
                    console.error("Error adding activity: ", error);
                }
            );
            handleOnGoingGoals()
        }
    }

    return (
        <div className="fixed bottom-10 left-0 w-full p-4 text-white z-10">
            <div className="bg-black p-4 flex justify-between items-center rounded-xl">
                <div>
                    <div>
                    {t("general.duration")}: <span className='font-bold'>{formatTime(elapsedTime)}</span>
                    </div>
                    <div>{t("general.kilometers")}: <span className='font-bold'>{distance.toFixed(2)} km</span></div>
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
            {showAlertBox && (
                <AlertBox text={alertMessage} setShowAlertBox={setShowAlertBox} />
            )}
        </div>
    )
}

export default RunningControls