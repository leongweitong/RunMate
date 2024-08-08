import React, {useState} from 'react'
import { BsPlusLg, BsCalendar, BsChevronRight } from 'react-icons/bs'
import ModalCreateGoal from '../components/ModalCreateGoal'

const GoalPage = () => {
  const [tab, setTab] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const activeTab = (index) => index === tab ? 'bg-primary text-white rounded' : ''
  
  return (
    <div className='flex flex-col gap-4'>
      <div className="border-b border-secondary px-4 py-3">
        <div className="flex gap-2 items-center justify-between">
            <div className='text-primary text-xl font-semibold'>Goal</div>
            <button onClick={() => setShowModal(true)}>
              <BsPlusLg className='text-3xl text-primary' />
            </button>
        </div>
      </div>

      <div className="px-4">
        <div className='flex items-center justify-between gap-4'>
          <button onClick={() => setTab(0)} className={`${activeTab(0)} px-4 py-2`}>In Progress</button>
          <button onClick={() => setTab(1)} className={`${activeTab(1)} px-4 py-2`}>Completed</button>
          <button onClick={() => setTab(2)} className={`${activeTab(2)} px-4 py-2`}>Failed</button>
        </div>
      </div>

      <div className="px-4">
        <div className='bg-white rounded-lg shadow mb-2'>
          <div className='px-4 py-2'>
              <div className="flex items-center justify-between mb-2">
                <p className='font-semibold'>Running 10 KM In Aug</p>
                <BsChevronRight className='text-lg' />
              </div>
              <div className='w-full bg-gray-200 h-3 rounded mb-2'>
                  <div className='bg-primary h-3 rounded' style={{ width: '40%' }}></div>
              </div>
          </div>
          <div className='px-4 py-2 border-t flex items-center gap-2'>
            <BsCalendar className='opacity-70' />
            <span>End Time - 2024-08-20</span>
          </div>
        </div>
      </div>

      {showModal && <ModalCreateGoal setShowModal={setShowModal} />}

    </div>
  )
}

export default GoalPage