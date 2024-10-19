import React from 'react'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'

const AlertBox = ({text='Error', setShowAlertBox, haveNavigate=false, navigatePage=''}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('Overlay')) {
            setShowAlertBox(false);
            navigateOtherPage();
        }
    }

    const handleCloseModal = (e) => {
        setShowAlertBox(false);
        navigateOtherPage();
    }

    const navigateOtherPage = () => {
        if(!haveNavigate) return;
        navigate(navigatePage);
    }

    return (
        <div onClick={handleOverlayClick} className="Overlay">
            <div className="Modal">
                <div className="p-4 flex-col">
                    <div className='font-semibold'>{text}</div>
                    <div className="mt-2 flex justify-end">
                        <button
                            className='px-6 py-1 rounded'
                            onClick={handleCloseModal}
                        >
                            {t("general.ok")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertBox