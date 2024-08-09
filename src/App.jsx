import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import AnalysisPage from './pages/AnalysisPage';
import GoalPage from './pages/GoalPage';
import MenuPage from './pages/MenuPage';
import RunningPage from './pages/RunningPage';
import "./i18n";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) i18n.changeLanguage(storedLanguage); 
    else localStorage.setItem('language', 'en');
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="goal" element={<GoalPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="/running" element={<RunningPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
