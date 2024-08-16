import React, {useState, useEffect} from 'react'
import { BsPlusLg, BsCalendar, BsChevronRight } from 'react-icons/bs'
import ModalCreateGoal from '../components/ModalCreateGoal'
import { useTranslation } from "react-i18next";
import { getGoalsByStatus } from '../indexedDBUtils';
import { Link } from 'react-router-dom';
import { calcGoalProgress } from '../utils/calcGoalProgress';

const GoalPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('0')
  const [showModal, setShowModal] = useState(false)
  const [goals, setGoals] = useState(null)

  const activeTab = (index) => index === tab ? 'bg-primary text-white rounded' : ''

  const fetchGoals = async () => {
    try {
      const results = await getGoalsByStatus(tab);
      setGoals(results.reverse());
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [tab]);
  
  return (
    <div className='flex flex-col gap-4'>
      <div className="border-b border-secondary px-4 py-3">
        <div className="flex gap-2 items-center justify-between">
            <div className='text-primary text-xl font-semibold'>{t("goal")}</div>
            <button onClick={() => setShowModal(true)}>
              <BsPlusLg className='text-3xl text-primary' />
            </button>
        </div>
      </div>

      <div className="px-4">
        <div className='flex items-center justify-between gap-2'>
          <button onClick={() => setTab('0')} className={`${activeTab('0')} px-4 py-2`}>{t("on-going")}</button>
          <button onClick={() => setTab('1')} className={`${activeTab('1')} px-4 py-2`}>{t("completed")}</button>
          <button onClick={() => setTab('2')} className={`${activeTab('2')} px-4 py-2`}>{t("failed")}</button>
        </div>
      </div>

      <div className="px-4">
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow mb-4">
              <Link to={`${goal.id}`}>
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{goal.name}</p>
                    <BsChevronRight className="text-lg" />
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded mb-2">
                    <div className="bg-primary h-3 rounded"
                      style={{
                        width: `${calcGoalProgress(goal.currentDistance, goal.totalDistance)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
              <div className="px-4 py-2 border-t flex items-center gap-2">
                <BsCalendar className="opacity-70" />
                <span>{t("end-time")} - {goal.endTime}</span>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>{t("general.no-record")}</p> // Display message if no goals
        )}
      </div>

      {showModal && <ModalCreateGoal setShowModal={setShowModal} refreshGoals={fetchGoals} />}

    </div>
  )
}

export default GoalPage