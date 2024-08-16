import React, {useEffect} from 'react'
import { useTranslation } from "react-i18next";
import { BsTranslate, BsActivity, BsChevronRight, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useIndexedDB } from "react-indexed-db-hook";

const MenuPage = () => {
  const { clear } = useIndexedDB("activity");
  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleClear = () => {
    const confirm = window.confirm(t('quote.clearActivity.confirmMessage'));

    if(!confirm) return 

    clear().then(() => {
      alert(t('quote.clearActivity.successMessage'));
    });
  }

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
          <select onChange={changeLanguage} value={i18n.language} name="language" id="language" className='outline-none border border-black rounded px-4'>
            <option value="zh">中文</option>
            <option value="en">English</option>
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
      </div>
    </div>
  )
}

export default MenuPage