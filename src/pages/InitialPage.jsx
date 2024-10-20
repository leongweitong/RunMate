import React, { useState } from 'react';
import { BsGenderMale, BsGenderFemale } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const InitialPage = () => {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({
    gender: '',
    name: '',
    height: '',
    weight: ''
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handle next step navigation
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Handle previous step navigation
  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Handle updating user information
  const handleInputChange = (key, value) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };

  // Step 1: Gender selection
  const renderGenderStep = () => (
    <div className="flex flex-col items-center h-full justify-center">
      <h2 className="text-xl font-semibold mb-4">{t('select-gender')}</h2>
      <div className="flex gap-8 mb-6">
        <button
          className={`flex flex-col items-center p-6 border-2 rounded-xl ${userInfo.gender === 'male' ? 'border-blue-500' : 'border-gray-300'}`}
          onClick={() => handleInputChange('gender', 'male')}
        >
          <BsGenderMale className="text-5xl text-blue-500" />
          <span className="mt-2">{t('male')}</span>
        </button>
        <button
          className={`flex flex-col items-center p-6 border-2 rounded-xl ${userInfo.gender === 'female' ? 'border-pink-500' : 'border-gray-300'}`}
          onClick={() => handleInputChange('gender', 'female')}
        >
          <BsGenderFemale className="text-5xl text-pink-500" />
          <span className="mt-2">{t('female')}</span>
        </button>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleNextStep}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!userInfo.gender}
        >
          {t('general.next')}
        </button>
      </div>
    </div>
  );

  // Step 2: Name input
  const renderNameStep = () => (
    <div className="flex flex-col items-center h-full justify-center">
      <h2 className="text-xl font-semibold mb-4">{t('enter-name')}</h2>
      <input
        type="text"
        value={userInfo.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className="border p-2 rounded mb-6 w-64"
        placeholder={t('enter-name')}
      />
      <div className="absolute bottom-4 right-4 flex gap-4">
        <button onClick={handlePrevStep} className="bg-gray-300 px-4 py-2 rounded">
        {t('general.back')}
        </button>
        <button
          onClick={handleNextStep}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!userInfo.name}
        >
          {t('general.next')}
        </button>
      </div>
    </div>
  );

  // Step 3: Height input
  const renderHeightStep = () => (
    <div className="flex flex-col items-center h-full justify-center">
      <h2 className="text-xl font-semibold mb-4">{t('enter-height')} (cm)</h2>
      <input
        type="number"
        value={userInfo.height}
        onChange={(e) => handleInputChange('height', e.target.value)}
        className="border p-2 rounded mb-6 w-64"
        placeholder={`${t('enter-height')} (cm)`}
      />
      <div className="absolute bottom-4 right-4 flex gap-4">
        <button onClick={handlePrevStep} className="bg-gray-300 px-4 py-2 rounded">
        {t('general.back')}
        </button>
        <button
          onClick={handleNextStep}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!userInfo.height}
        >
          {t('general.next')}
        </button>
      </div>
    </div>
  );

  // Step 4: Weight input
  const renderWeightStep = () => (
    <div className="flex flex-col items-center h-full justify-center">
      <h2 className="text-xl font-semibold mb-4">{t('enter-weight')} (kg)</h2>
      <input
        type="number"
        value={userInfo.weight}
        onChange={(e) => handleInputChange('weight', e.target.value)}
        className="border p-2 rounded mb-6 w-64"
        placeholder={`${t('enter-weight')} (kg)`}
      />
      <div className="absolute bottom-4 right-4 flex gap-4">
        <button onClick={handlePrevStep} className="bg-gray-300 px-4 py-2 rounded">
        {t('general.back')}
        </button>
        <button
          onClick={() => {
            console.log(userInfo);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            navigate('/');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!userInfo.weight}
        >
          {t('general.finish')}
        </button>
      </div>
    </div>
  );

  // Step rendering based on the current step
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg w-96">
        {step === 1 && renderGenderStep()}
        {step === 2 && renderNameStep()}
        {step === 3 && renderHeightStep()}
        {step === 4 && renderWeightStep()}
      </div>
    </div>
  );
};

export default InitialPage;