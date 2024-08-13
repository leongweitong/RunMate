import React, {useState,useEffect} from 'react'
import { useTranslation } from "react-i18next";
import { BsArrowLeftShort, BsChevronRight } from 'react-icons/bs';
import { FaPersonRunning } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useIndexedDB  } from "react-indexed-db-hook";

const ActivityPage = () => {
    const { getAll } = useIndexedDB("activity");
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [activities, setActivities] = useState(null)

    useEffect(() => {
        getAll().then((activities) => {
            console.log(activities)
            setActivities(activities);
        }).catch((error) => {
            console.error('Error fetching activities:', error);
        });
    }, []);

    if(!activities) {
        <div className='text-center'>{t("general.loading")}</div>;
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
                    activities.map((activity) => (
                        <div key={activity.id} className='border-b border-secondary py-2 mb-4'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='text-lg font-semibold capitalize'>{activity.type}</div>
                                    <div className='text-sm text-gray-500'>{`Distance: ${activity.totalDistance} meters`}</div>
                                </div>
                                <Link to={`/activity/${activity.id}`} className='text-primary text-xl'>
                                    <BsChevronRight />
                                </Link>
                            </div>
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