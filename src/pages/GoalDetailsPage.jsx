import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useIndexedDB } from "react-indexed-db-hook";
import { BsCalendar, BsFlag, BsArrowLeftShort, BsTrash, BsCheck2 } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { calcGoalProgress } from '../utils/calcGoalProgress';
const GoalDetailsPage = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { getByID, deleteRecord, update } = useIndexedDB("goal");
    const [goal, setGoal] = useState(null);
    const { t } = useTranslation();

    const handleDelete = () => {
        const userConfirmed = window.confirm("Are you sure you want to delete this goal?");

        if(!userConfirmed) return 
        
        deleteRecord(Number(id)).then((event) => {
            alert(`Goal deleted successfully!`);
            navigate('/goal');
        }).catch((error) => {
            console.error("Error deleting goal:", error);
            alert("Failed to delete the goal. Please try again.");
        });
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleDailyTask = () => {
        if(!goal || goal.type !== 'daily') return;

        const newDistance = goal.currentDistance + 1;

        const newStatus = newDistance >= goal.totalDistance ? '1' : '0';

        const updatedGoal = {
            ...goal,
            currentDistance: newDistance,
            status: newStatus,
        };

        update(updatedGoal).then(() => {
            setGoal(updatedGoal);
        }).catch((error) => {
            console.error("Error updating goal:", error);
            alert("Failed to update the goal. Please try again.");
        });
    }

    useEffect(() => {
        getByID(Number(id)).then((goal) => {
            console.log(goal)
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
                                    style={{width: `${calcGoalProgress(goal.currentDistance, goal.totalDistance)}%`}}
                                ></div>
                            </div>
                            <div className='flex justify-between'>
                                <div>0</div>
                                <div>{goal.totalDistance}</div>
                            </div>
                        </div>
                        <div className="px-4 py-2 border-t flex items-center gap-2">
                            <BsCalendar className="opacity-70" />
                            <span>{t("end-time")} - {goal.endTime}</span>
                        </div>
                    </div>
                ) : (
                    <p className='text-center'>{t("general.loading")} ...</p>
                )}
            </div>

            {goal?.type === 'daily' && (<div className="px-4">
                <div className='grid grid-cols-7 gap-4 rounded-lg shadow p-4'>
                    {Array.from({ length: goal.totalDistance }).map((_, index) => (
                        <div key={index} className={`w-6 h-6 mx-auto rounded flex items-center justify-center 
                            ${index < goal.currentDistance ? 'bg-secondary' : 'bg-gray-200'}`}
                        >
                        {index < goal.currentDistance && <BsCheck2 className="text-primary text-xl" />}
                        </div>
                    ))}
                </div>
                {goal.currentDistance < goal.totalDistance &&(<div className='mt-8'>
                    <button onClick={handleDailyTask} className='w-full bg-primary rounded text-white py-2'>Check In</button>
                </div>)}
            </div>)}
        </div>
    )
}

export default GoalDetailsPage