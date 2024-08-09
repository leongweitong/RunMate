import React from 'react'
import { useTranslation } from "react-i18next";

const AnalysisPage = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="border-b border-secondary px-4 py-3">
          <div className='text-primary text-xl font-semibold'>{t("analysis")}</div>
      </div>
    </div>
  )
}

export default AnalysisPage