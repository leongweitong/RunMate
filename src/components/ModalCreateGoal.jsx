import React, {useState, useEffect} from 'react'
import { BsXLg } from 'react-icons/bs'
import { useTranslation } from "react-i18next";
import { useIndexedDB } from "react-indexed-db-hook";

const ModalCreateGoal = ({setShowModal, refreshGoals}) => {
    const { t } = useTranslation();
    const [minDate, setMinDate] = useState("");
    const { add } = useIndexedDB("goal");

    const [name, setName] = useState('')
    const [totalDistance, setTotalDistance] = useState('')
    const [totalDay, setTotalDay] = useState('');
    const [endTime, setEndTime] = useState('')
    const [checkinTime, setCheckinTime] = useState('');
    const [type, setType] = useState('running')
    const [status, setStatus] = useState('0')

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
        e.preventDefault();

        const goalData = {
            name,
            type,
            status
        };

        if (type === 'running') {
            goalData.currentDistance = 0;
            goalData.totalDistance = totalDistance;
            goalData.endTime = endTime;
        } else if (type === 'daily') {
            goalData.currentDay = 0;
            goalData.totalDay = totalDay;
            goalData.checkinTime = checkinTime;
            goalData.lastCheckinDate = new Date().toISOString()
        }

        add(goalData).then(
            (event) => {
                console.log("Goal ID Generated: ", event);
                setShowModal(false);
                refreshGoals();
            },
            (error) => {
                console.error("Error adding goal: ", error);
            }
        );
    };

    return (
        <div onClick={handleOverlayClick} className="Overlay">
            <div className="Modal">
            <div className="flex items-center justify-between border-b px-4 py-2">
                <div className='font-semibold'>{t("create-goal")}</div>
                <BsXLg onClick={() => setShowModal(false)} />
            </div>
            <div className="px-4 py-2">
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col mb-2'>
                        <label htmlFor="name">{t("general.type")}</label>
                        <select name="type" id="type" value={type} onChange={(e) => setType(e.target.value)} className='w-full border border-primary rounded outline-none px-2 py-1' required>
                            <option value="running">{t("general.running")}</option>
                            <option value="daily">{t("general.daily")}</option>
                        </select>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label htmlFor="name">{t("goal-name")}</label>
                        <input id='name' type="text" value={name} onChange={(e) => setName(e.target.value)} 
                            className='w-full border border-primary rounded outline-none px-2 py-1' 
                            placeholder='Running 10 km' required 
                        />
                    </div>
                    {type === 'running' ? (
                            <>
                                <div className='flex flex-col mb-2'>
                                    <label htmlFor="totalDistance">{t("general.totalDistance")}</label>
                                    <input id='totalDistance' type="number" value={totalDistance} onChange={(e) => setTotalDistance(Number(e.target.value))} 
                                        className='w-full border border-primary rounded outline-none px-2 py-1' 
                                        placeholder='10' min={1} required 
                                    />
                                </div>
                                <div className='flex flex-col mb-2'>
                                    <label htmlFor="endTime">{t("end-time")}</label>
                                    <input id='endTime' type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)} min={minDate} 
                                        className='w-full border border-primary rounded outline-none px-2 py-1' required 
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col mb-2'>
                                    <label htmlFor="totalDay">{t("general.total-day")}</label>
                                    <input id='totalDay' type="number" value={totalDay} onChange={(e) => setTotalDay(Number(e.target.value))} 
                                        className='w-full border border-primary rounded outline-none px-2 py-1' 
                                        placeholder='7' min={1} required 
                                    />
                                </div>
                                <div className='flex flex-col mb-2'>
                                    <label htmlFor="checkinTime">{t("general.checkin-time")}</label>
                                    <input id='checkinTime' type="time" value={checkinTime} onChange={(e) => setCheckinTime(e.target.value)} 
                                        className='w-full border border-primary rounded outline-none px-2 py-1' required 
                                    />
                                </div>
                            </>
                        )}
                    <div className='flex flex-col mt-6 mb-4'>
                        <button className='w-full bg-primary text-white py-1 rounded'>{t("general.create")}</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default ModalCreateGoal