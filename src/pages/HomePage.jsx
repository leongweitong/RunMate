import React, {useState, useEffect } from 'react'
import Weather from '../components/Weather'
import MotivationQuote from '../components/MotivationQuote'
import { BsPlayFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { getGoalsByStatus } from '../indexedDBUtils';
import { useIndexedDB } from "react-indexed-db-hook";
import {formatTime} from '../utils/formatTime';
import { calcGoalProgress } from '../utils/calcGoalProgress';
import UserInfo from '../components/UserInfo';

const getOnLineStatus = () =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

const HomePage = () => {
    const { t } = useTranslation();
    const [goals, setGoals] = useState(null)
    const [activities, setActivities] = useState(null)
    const { getAll } = useIndexedDB("activity");
    const [status, setStatus] = useState(getOnLineStatus());
    const [userInfo, setUserInfo] = useState({
        totalTimeRunning: 0,
        totalActivities: 0,
        totalDistance: 0,
        longestRun: 0,
        streak: 0,
        goalsCompleted: 0
    });

    const setOnline = () => setStatus(true);
    const setOffline = () => setStatus(false);

    const fetchGoals = async () => {
        try {
          const results = await getGoalsByStatus('0');
          setGoals(results);
        } catch (error) {
          console.error('Error fetching goals:', error);
        }
    };

    const fetchActivities = async () => {
        getAll().then((activities) => {
            const sortedActivities = activities.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
        
            setActivities(sortedActivities.slice(0, 3));

            const totalActivities = sortedActivities.length;
            let totalDistance = 0;
            let longestRun = 0;

            sortedActivities.forEach(activity => {
                totalDistance += activity.totalDistance;
                if (activity.totalDistance > longestRun) {
                    longestRun = activity.totalDistance;
                }
            });

            const totalTimeRunning = sortedActivities.reduce((totalTime, activity) => totalTime + activity.time, 0);

            let streak = 0;
            let currentDate = new Date();
            let dateHaveCheck = false
            currentDate.setHours(0, 0, 0, 0);

            for (let i = 0; i < sortedActivities.length; i++) {
                const activityDate = new Date(sortedActivities[i].createTime);
                activityDate.setHours(0, 0, 0, 0); // Set activityDate to midnight
                
                // Calculate the difference between currentDate and activityDate in days
                const diffInDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));

                // If the activity happened today or yesterday
                if (dateHaveCheck && currentDate.getTime() === activityDate.getTime()) {
                    continue; 
                } else if (diffInDays === 0 || diffInDays === 1) {
                    // If the activity happened yesterday, increment the streak
                    streak++;
                    dateHaveCheck = true;
                    currentDate = activityDate; // Update currentDate to the activityDate for the next comparison
                } else {
                    // If the activity was more than 1 day ago, break the streak loop
                    break;
                }
            }
            
            // If no activity happened yesterday, streak should remain 0
            if (streak === 0 && sortedActivities.length > 0) {
                const mostRecentActivityDate = new Date(sortedActivities[0].createTime);
                mostRecentActivityDate.setHours(0, 0, 0, 0);
            
                const diffInDaysFromToday = Math.floor((new Date() - mostRecentActivityDate) / (1000 * 60 * 60 * 24));
                
                // If the most recent activity wasn't yesterday, reset the streak to 0
                if (diffInDaysFromToday > 1) {
                    streak = 0;
                }
            }

            setUserInfo((info) => ({
                ...info,
                totalTimeRunning,
                totalActivities,
                totalDistance,
                longestRun,
                streak
            }));
        });
    };
    
    const fetchUserInfo = async () => {
        const results = await getGoalsByStatus('1');
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo((info) => ({
                ...info,
                ...parsedUserInfo,
                goalsCompleted: results.length
            }));
        }
        
    }

    useEffect(() => {
        fetchGoals()
        fetchActivities()
        fetchUserInfo()

        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, []);

    return (
        <div>
            <UserInfo user={userInfo} />
            {
                status && (<>
                    <Weather /> 
                </>)
            }
            
            <div className='mt-6 px-4'>
                <Link to="/running" className='w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center text-lg'>
                    <BsPlayFill className='text-2xl mr-2' /> {t("general.start")}
                </Link>
            </div>

            <div className='mt-6 px-4'>
                <div className='flex justify-between mb-2'>
                    <div className='font-bold'>{t("current-goals")}</div>
                    <Link to='/goal'>
                        <div className='underline underline-offset-2 text-primary'>{t("general.see-all")}</div>
                    </Link>
                </div>
                {goals && goals.length > 0 ? (
                    goals.map(goal => (
                        <div key={goal.id} className='bg-white rounded-lg shadow p-4 mb-2'>
                            <p className='mb-1 font-bold opacity-80'>{goal.name}</p>
                            <div className='w-full bg-gray-200 h-3 rounded'>
                                {
                                    goal.type === 'running' ?
                                    <div className='bg-primary h-3 rounded' style={{ width: `${calcGoalProgress(goal.currentDistance, goal.totalDistance)}%` }}></div>
                                    :
                                    <div className='bg-primary h-3 rounded' style={{ width: `${calcGoalProgress(goal.currentDay, goal.totalDay)}%` }}></div>
                                }
                            </div>
                        </div>
                        )
                    )
                ) : (
                    <p className='text-center'>{t("general.no-record")}</p>
                )}
            </div>

            <div className='mt-6 px-4'>
                <div className='flex justify-between mb-2'>
                    <div className='font-bold'>{t("recent-activity")}</div>
                    <Link to='/activity'>
                        <div className='underline underline-offset-2 text-primary'>{t("general.see-all")}</div>
                    </Link>
                </div>
                {activities && activities.length > 0 ? (
                    activities.map((activity) => (
                    <Link to={`activity/${activity.id}`} key={activity.id}>
                    <div className='bg-white p-4 rounded-lg shadow flex items-center gap-2 mb-2'>
                        {
                           activity.type === 'running' ? 
                           (<img src="/runmateIcon.png" alt="runmate-image" className='h-14 w-14 rounded-xl' />) :
                           (<img src="/runmateIcon.png" alt="runmate-image" className='h-14 w-14 rounded-xl' />)
                        } 
                        
                        <div>
                        <p className='font-bold opacity-80 text-sm'>{t(`general.${activity.type}`)} - {new Date(activity.createTime).toLocaleDateString()}</p>
                        <p className='font-bold'>{(activity.totalDistance).toFixed(2)} km</p>
                        <p className='text-sm'>{formatTime(activity.time)}</p>
                        </div>
                    </div>
                    </Link>
                    ))
                ) : (
                    <div className='text-center'>{t("general.no-record")}</div>
                )}
            </div>
        </div>
    )
}

export default HomePage