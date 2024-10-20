import React, {useState,useEffect} from 'react'
import { useTranslation } from "react-i18next";
import { BsArrowLeftShort, BsChevronRight } from 'react-icons/bs';
import { FaPersonRunning } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useIndexedDB  } from "react-indexed-db-hook";
import {formatTime} from '../utils/formatTime'

const ActivityPage = () => {
    const { getAll } = useIndexedDB("activity");
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [activities, setActivities] = useState(null)

    useEffect(() => {
        getAll().then((activities) => {
            console.log(activities)
            const sortedActivities = activities.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            setActivities(sortedActivities);
        }).catch((error) => {
            console.error('Error fetching activities:', error);
        });
    }, []);

    if(!activities) {
        <div className='text-center'>{t("general.loading")}</div>;
    }

    const formatDate = (time) => {
        const date = new Date(time);

        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${month}/${day} ${hours}:${minutes}`;
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="border-b border-secondary px-4 py-3">
                <div className="flex gap-2 items-center justify-between">
                    <BsArrowLeftShort onClick={() => navigate(-1)} className='text-3xl text-primary' />
                    <div className='text-primary text-xl font-semibold'>{t("general.activity")}</div>
                    <Link to='/running'>
                        <FaPersonRunning className='text-2xl text-primary' />
                    </Link>
                </div>
            </div>

            <div className='px-4'>
                {activities && activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={activity.id} className='border border-secondary rounded-md p-2 mb-4'>
                            <Link to={`/activity/${activity.id}`} className='flex items-center gap-2'>
                                <div className="flex items-center justify-center">{index+1}.</div>
                                <div className='flex flex-1 items-center justify-between'>
                                    <div>
                                        <div className='text-lg font-semibold capitalize'>{activity.type} - {formatTime(activity.time)}</div>
                                        <div className='text-sm text-gray-500'>{`Distance: ${activity.totalDistance} km`} {formatDate(activity.createTime)}</div>
                                    </div>
                                    <BsChevronRight className='text-primary text-xl' />
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className='text-center text-gray-500'>{t("general.no-record")}</div>
                )}
            </div>
        </div>
    )
}

export default ActivityPage