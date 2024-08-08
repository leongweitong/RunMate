import React, {useState, useEffect} from 'react'
import { BsXLg } from 'react-icons/bs'

const ModalCreateGoal = ({setShowModal}) => {
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        const getTomorrowDate = () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedDate = tomorrow.toISOString().split("T")[0];
            setMinDate(formattedDate);
        }

        getTomorrowDate()
    }, []);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('Overlay')) {
            setShowModal(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('submit')
    }

    return (
        <div onClick={handleOverlayClick} className="Overlay">
            <div className="Modal">
            <div className="flex items-center justify-between border-b px-4 py-2">
                <div className='font-semibold'>Create Goal</div>
                <BsXLg onClick={() => setShowModal(false)} />
            </div>
            <div className="px-4 py-2">
                <form onSubmit={handleSubmit}>
                <div className='flex flex-col mb-2'>
                    <label htmlFor="name">Goal Name</label>
                    <input id='name' type="text" className='border border-primary rounded outline-none px-2 py-1' placeholder='Running 10 km' required />
                </div>
                <div className='flex flex-col mb-2'>
                    <label htmlFor="endTime">End Time</label>
                    <input id='endTime' type="date" min={minDate} className='border border-primary rounded outline-none px-2 py-1' required />
                </div>
                <div className='flex flex-col mt-6 mb-4'>
                    <button className='w-full bg-primary text-white py-1 rounded'>Create</button>
                </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default ModalCreateGoal