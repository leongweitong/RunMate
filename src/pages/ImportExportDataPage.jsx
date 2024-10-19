import React, { useState } from 'react'
import { exportData } from '../exportData';
import { importData } from '../importData';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import AlertBox from '../components/AlertBox';

const ImportExportDataPage = () => {
    const [importedFile, setImportedFile] = useState(null);
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [showAlertBox, setShowAlertBox] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleAlertBox = (text) => {
        setAlertMessage(text);
        setShowAlertBox(true);
    };

    const handleExportData = () => {
        exportData('MyDB', 'activity')
          .then(message => handleAlertBox(message))
          .catch(error => handleAlertBox(error));
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImportedFile(file);
    }

    const handleImportData = () => {
        if (importedFile) {
            importData('MyDB', 'activity', importedFile).then(message => handleAlertBox(message)).catch(error => handleAlertBox(error));
        } else {
            handleAlertBox(t('quote.alert.select-import-file'));
        }
    }

    return (
        <>
        <div className="border-b border-secondary px-4 py-3">
            <div className="flex gap-2 items-center justify-between">
                <BsArrowLeftShort onClick={() => navigate(-1)} className='text-3xl text-primary' />
                <div className='text-primary text-xl font-semibold'>{t("import-export-data")}</div>
                <BsArrowLeftShort onClick={() => navigate(-1)} className='text-3xl text-primary invisible' />
            </div>
        </div>

        <div className='p-4 flex flex-col gap-4'>
            <div className="border py-2 rounded text-center">
                <button onClick={handleExportData}>{t("export-data")}</button>
            </div>

            <div className="my-4 flex items-center">
                <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                <div className="flex-grow-0 mx-5">{t("general.or")}</div>
                <div className="flex-grow bg bg-gray-300 h-0.5"></div>
            </div>

            <input className='block w-full border rounded' type="file" accept=".json" onChange={handleFileChange} />
            <button className='block w-full border rounded py-2' onClick={handleImportData}>{t("import-data")}</button>

            {showAlertBox && (
                <AlertBox text={alertMessage} setShowAlertBox={setShowAlertBox} />
            )}
        </div>
        </>
    )
}

export default ImportExportDataPage