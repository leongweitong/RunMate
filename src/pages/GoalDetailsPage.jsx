import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useIndexedDB } from "react-indexed-db-hook";
import { BsCalendar, BsFlag, BsArrowLeftShort, BsTrash, BsCheck2 } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { calcGoalProgress } from '../utils/calcGoalProgress';
import AlertBox from '../components/AlertBox';
import ConfirmBox from '../components/ConfirmBox';

const GoalDetailsPage = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { id } = useParams();
    const { getByID, deleteRecord, update } = useIndexedDB("goal");
    const [goal, setGoal] = useState(null);
    const [canCheckin, setCanCheckin] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showAlertBox, setShowAlertBox] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [guide, setGuide] = useState({});

    const handleAlertBox = (text) => {
        setAlertMessage(text);
        setShowAlertBox(true);
    };

    const handleDelete = () => {
        setGuide({haveFunction:true, fn:deleteGoal})
        setAlertMessage(t("quote.confirm.delete-goal"))
        setShowConfirmBox(true);
    }

    const deleteGoal = () => {
        deleteRecord(Number(id)).then((event) => {
            handleAlertBox(t("quote.alert.goal-delete-success"));
        }).catch((error) => {
            console.error("Error deleting goal:", error);
            handleAlertBox(t("quote.alert.goal-delete-error"));
        });
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleDailyTask = () => {
        if(!goal || goal.type !== 'daily') return;

        setCanCheckin(false)

        const newDay = goal.currentDay + 1;

        const newStatus = newDay >= goal.totalDay ? '1' : '0';

        const updatedGoal = {
            ...goal,
            currentDay: newDay,
            status: newStatus,
            lastCheckinDate: new Date().toISOString()
        };

        update(updatedGoal).then(() => {
            setGoal((prevGoal) => ({
                ...updatedGoal,
                progress: calcGoalProgress(newDay, goal.totalDay),
            }));
        }).catch((error) => {
            console.error("Error updating goal:", error);
            handleAlertBox(t("quote.alert.goal-update-error"));
        });
    }

    useEffect(() => {
        getByID(Number(id)).then((goal) => {
            console.log(goal)
            const progress = goal.type === 'running' 
            ? calcGoalProgress(goal.currentDistance, goal.totalDistance)
            : calcGoalProgress(goal.currentDay, goal.totalDay);
            goal.progress = progress;

            if (goal && goal.type === 'daily') {
                const lastCheckinDate = new Date(goal.lastCheckinDate); // This is in ISO format
                const today = new Date();
                
                today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for comparison
                
                // Parse goal's checkin time and set the check-in period
                const [checkinHour, checkinMinute] = goal.checkinTime.split(':').map(Number);
                const checkinStartTime = new Date(today);
                checkinStartTime.setHours(checkinHour, checkinMinute, 0, 0);
                
                const checkinEndTime = new Date(checkinStartTime);
                checkinEndTime.setMinutes(checkinEndTime.getMinutes() + 10); // 10-minute window
                
                const currentTime = new Date(); // Current time for comparison
            
                // Convert lastCheckinDate to local time by comparing the day, not just the date
                const lastCheckinLocal = new Date(lastCheckinDate.setHours(0, 0, 0, 0));
            
                if (lastCheckinLocal.getTime() === today.getTime()) {
                    setCanCheckin(false); // Already checked in today
                } 
                else if(currentTime.getTime() >= checkinStartTime.getTime() && currentTime.getTime() <= checkinEndTime.getTime()) {
                    setCanCheckin(true);
                }
                else {
                    setCanCheckin(false);
                }
            }            
            setGoal(goal);
        });
    }, []);

    return (
        <div className='flex flex-col gap-4'>
            <div className="border-b border-secondary px-4 py-3">
                <div className="flex gap-2 items-center justify-between">
                    <BsArrowLeftShort onClick={handleGoBack} className='text-3xl text-primary' />
                    <div className='text-primary text-xl font-semibold'>{t("goal-details")}</div>
                    <BsTrash onClick={handleDelete} className='text-xl text-primary' />
                </div>
            </div>
            <div className="px-4">
                {goal ? (
                    <div className="bg-white rounded-lg shadow mb-4">
                        <div className="px-4 py-2">
                            <div className="flex items-center gap-4 mb-2">
                            <p className="font-semibold capitalize">{t(`general.${goal.type}`)}</p>
                            <p>-</p>
                            <p className="font-semibold">{goal.name}</p>
                            </div>
                            <div className="w-full bg-gray-200 h-3 rounded mb-2">
                                <div className="bg-primary h-3 rounded"
                                    style={{width: `${goal.progress}%`}}
                                ></div>
                            </div>
                            <div className='flex justify-between'>
                                <div>0</div>
                                <div>{goal.type === 'running' ? goal.totalDistance : goal.totalDay}</div>
                            </div>
                        </div>
                        {goal.type === 'running' ? 
                        (<div className="px-4 py-2 border-t flex items-center gap-2">
                            <BsCalendar className="opacity-70" />
                            <span>{t("end-time")} - {goal.endTime}</span>
                        </div>) : 
                        (<div className="px-4 py-2 border-t flex items-center gap-2">
                            <BsCalendar className="opacity-70" />
                            <span>{t("general.checkin-time")} - {goal.checkinTime}</span>
                        </div>)}
                    </div>
                ) : (
                    <p className='text-center'>{t("general.loading")} ...</p>
                )}
            </div>

            {goal?.type === 'daily' && (<div className="px-4">
                <div className='grid grid-cols-7 gap-4 rounded-lg shadow p-4'>
                    {Array.from({ length: goal.totalDay }).map((_, index) => (
                        <div key={index} className={`w-6 h-6 mx-auto rounded flex items-center justify-center 
                            ${index < goal.currentDay ? 'bg-secondary' : 'bg-gray-200'}`}
                        >
                        {index < goal.currentDay && <BsCheck2 className="text-primary text-xl" />}
                        </div>
                    ))}
                </div>
                {canCheckin && goal.currentDay < goal.totalDay &&(<div className='mt-8'>
                    <button onClick={handleDailyTask} className='w-full bg-primary rounded text-white py-2'>Check In</button>
                </div>)}
            </div>)}

            {showAlertBox && (
                <AlertBox text={alertMessage} setShowAlertBox={setShowAlertBox} haveNavigate={true} navigatePage={'/goal'} />
            )}

            {showConfirmBox && (
                <ConfirmBox text={alertMessage} setShowConfirmBox={setShowConfirmBox} user={guide} />
            )}
        </div>
    )
}

export default GoalDetailsPage