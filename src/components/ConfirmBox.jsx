import React from 'react'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'

const ConfirmBox = ({text='Error', setShowConfirmBox, user={haveNavigate: false, navigatePage:'', haveFunction:false, fn}}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('Overlay')) {
            setShowConfirmBox(false);
        }
    }

    const handleCancel = () => {
        setShowConfirmBox(false);
    }

    const handleConfirm = () => {
        setShowConfirmBox(false);
        user.haveFunction && user.fn();

        if(!user.haveNavigate) return;
        navigate(user.navigatePage);
    }

    return (
        <div onClick={handleOverlayClick} className="Overlay">
            <div className="Modal">
                <div className="p-4 flex-col">
                    <div className='font-semibold'>{text}</div>
                    <div className="mt-2 flex justify-end">
                        <button className='px-6 py-1 rounded mr-4' onClick={handleCancel}>
                            {t("general.cancel")}
                        </button>
                        <button className='px-6 py-1 rounded' onClick={handleConfirm}>
                            {t("general.confirm")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBox