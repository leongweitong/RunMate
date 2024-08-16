import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useIndexedDB } from "react-indexed-db-hook";
import { BsCalendar, BsFlag, BsArrowLeftShort, BsTrash } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

const GoalDetailsPage = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { getByID, deleteRecord } = useIndexedDB("goal");
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
                                    style={{ width: `${(goal.currentDistance / goal.totalDistance) * 100 || 0}%` }}
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
        </div>
    )
}

export default GoalDetailsPage