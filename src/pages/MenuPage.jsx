import React, {useState} from 'react'
import { useTranslation } from "react-i18next";
import { BsTranslate, BsActivity, BsChevronRight, BsTrash, BsShieldCheck, BsCloudArrowDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useIndexedDB } from "react-indexed-db-hook";
import AlertBox from '../components/AlertBox';
import ConfirmBox from '../components/ConfirmBox';

const MenuPage = () => {
  const { clear } = useIndexedDB("activity");
  const { t, i18n } = useTranslation();
  const [showAlertBox, setShowAlertBox] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [guide, setGuide] = useState({});

  const handleAlertBox = (text) => {
      setAlertMessage(text);
      setShowAlertBox(true);
  };

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleClear = () => {
    setAlertMessage(t('quote.clearActivity.confirmMessage'))
    setGuide({haveFunction:true, fn:clearActivities})
    setShowConfirmBox(true)
  }

  const clearActivities = () => {
    clear().then(() => {
      handleAlertBox(t('quote.clearActivity.successMessage'));
    });
  }

  const openPrivacyPolicy = () => {
    if (window.cordova) {
      cordova.InAppBrowser.open('https://leongweitong.com/runmate-privacy', '_blank', 'location=yes');
    } else {
      window.open('https://leongweitong.com/runmate-privacy', '_blank');
    }
  };

  return (
    <div>
      <div className="border-b border-secondary px-4 py-3">
          <div className='text-primary text-xl font-semibold'>{t("menu")}</div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className='flex items-center justify-between pb-4 border-b'>
          <div className="flex items-center gap-4">
            <BsTranslate className='text-2xl' />
            <div>{t("languages")}</div>
          </div>
          <select onChange={changeLanguage} value={i18n.language} name="language" id="language" className='outline-none border border-black bg-white rounded px-4'>
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ms">Melayu</option>
          </select>
        </div>

        <Link to='/activity'>
          <div className='flex items-center justify-between pb-4 border-b'>
            <div className="flex items-center gap-4">
              <BsActivity className='text-2xl' />
              <div>{t("general.activity")}</div>
            </div>
            <BsChevronRight className='text-xl' />
          </div>
        </Link>

        <div className='flex items-center justify-between pb-4 border-b'>
          <div className="flex items-center gap-4">
            <BsTrash className='text-2xl' />
            <div>{t("general.clear")}</div>
          </div>
          <button onClick={handleClear} className='outline-none border border-black rounded px-4'>{t("general.clearing-activities")}</button>
        </div>

        <div onClick={openPrivacyPolicy} className='flex items-center justify-between pb-4 border-b'>
          <div className="flex items-center gap-4">
            <BsShieldCheck className='text-2xl' />
            <div>{t("general.privacy-policy")}</div>
          </div>
          <BsChevronRight className='text-xl' />
        </div>

        <Link to='/importexportdata'>
          <div className='flex items-center justify-between pb-4 border-b'>
            <div className="flex items-center gap-4">
              <BsCloudArrowDown className='text-2xl' />
              <div>{t("import-export-data")}</div>
            </div>
            <BsChevronRight className='text-xl' />
          </div>
        </Link>

        {showAlertBox && (
            <AlertBox text={alertMessage} setShowAlertBox={setShowAlertBox} />
        )}

        {showConfirmBox && (
          <ConfirmBox text={alertMessage} setShowConfirmBox={setShowConfirmBox} user={guide} />
        )}
      </div>
    </div>
  )
}

export default MenuPage