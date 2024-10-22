import React from 'react';
import { BsGeoAltFill, BsPersonCircle, BsActivity, BsCardChecklist, BsPencilSquare } from 'react-icons/bs';
import { FaTasks, FaRunning, FaClock } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

const UserInfo = ({ user }) => {
    const { t } = useTranslation();
    const {
        name,
        gender,
        height,
        weight,
        totalDistance,
        totalActivities,
        goalsCompleted,
        streak,
        longestRun,
        totalTimeRunning,
    } = user;

    return (
        <div className="p-4">
            <div className='bg-white rounded-lg shadow p-4 border border-2 border-y-primary'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <BsPersonCircle className='text-5xl opacity-70' />
                        <div className=''>
                            <div className='font-semibold'>{name}</div>
                            <div>{t(gender)} - {height}cm / {weight}kg</div>
                        </div>
                    </div>
                    <Link to="/initialuser">
                        <BsPencilSquare className='text-xl' />
                    </Link>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <ul className="text-gray-600">
                        <li className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1">
                            <BsGeoAltFill /> <span className='text-sm'>{t('general.total-distance')}:</span>
                            </span>
                            <span>{totalDistance.toFixed(2)}</span>
                        </li>
                        <li className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1">
                            <BsActivity /> <span className='text-sm'>{t('general.total-activities')}:</span>
                            </span>
                            <span>{totalActivities}</span>
                        </li>
                        <li className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1">
                            <FaClock /> <span className='text-sm'>{t('general.total-time')}:</span>
                            </span>
                            <span>{(totalTimeRunning / 1000 / 60 / 60).toFixed(2)}</span>
                        </li>
                    </ul>

                    <ul className="text-gray-600">
                        <li className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1">
                            <BsCardChecklist /> <span className='text-sm'>{t('general.streak')}:</span>
                            </span>
                            <span>{streak}</span>
                        </li>
                        <li className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1">
                            <FaRunning /> <span className='text-sm'>{t('general.longest-run')}:</span>
                            </span>
                            <span>{longestRun.toFixed(2)}</span>
                        </li>
                        <li className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1">
                            <FaTasks /> <span className='text-sm'>{t('general.goals-completed')}:</span>
                            </span>
                            <span>{goalsCompleted}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
