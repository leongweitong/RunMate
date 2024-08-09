import React, {useEffect} from 'react'
import "../i18n";
import { useTranslation } from "react-i18next";
import { BsTranslate } from 'react-icons/bs';

const MenuPage = () => {
  const { t, i18n  } = useTranslation();

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) i18n.changeLanguage(storedLanguage); 
    else localStorage.setItem('language', 'en');
  }, []);

  return (
    <div>
      <div className="border-b border-secondary px-4 py-3">
          <div className='text-primary text-xl font-semibold'>{t("menu")}</div>
      </div>

      <div className="p-4">
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
      </div>
    </div>
  )
}

export default MenuPage