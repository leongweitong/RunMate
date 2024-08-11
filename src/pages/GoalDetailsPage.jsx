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
            alert(`Goal ${event.name} deleted successfully!`);
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
                    <div className="bg-white rounded-lg shadow p-4">
                        <h1 className="text-2xl font-semibold mb-4">{goal.name}</h1>
                        <div className="flex items-center mb-4">
                            <BsCalendar className="mr-2" />
                            <span>{t("end-time")}: {goal.endTime}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <BsFlag className="mr-2" />
                            <span>{t("general.type")}: {goal.type}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <BsFlag className="mr-2" />
                            <span>{t("general.status")}: {goal.status === "0" ? t("on-going") : goal.status === "1" ? t("completed") : t("failed")}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded">
                            {/* Calculate progress width dynamically */}
                            <div
                                className="bg-primary h-3 rounded"
                                style={{ width: `${goal.currentDistance || 0}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <p>{t("loading-goal")}</p>
                )}
            </div>
        </div>
    )
}

export default GoalDetailsPage