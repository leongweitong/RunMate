import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import AnalysisPage from './pages/AnalysisPage';
import GoalPage from './pages/GoalPage';
import MenuPage from './pages/MenuPage';
import RunningPage from './pages/RunningPage';
import GoalDetailsPage from './pages/GoalDetailsPage';
import ActivityPage from './pages/ActivityPage';
import ActivityDetailsPage from './pages/ActivityDetailsPage';
import ImportExportDataPage from './pages/ImportExportDataPage';
import InitialPage from './pages/InitialPage';
import "./i18n";
import { useTranslation } from "react-i18next";
import { DBConfig } from "./DBConfig";
import { initDB } from "react-indexed-db-hook";
import ProtectedRoutes from './utils/ProtectedRoutes';

initDB(DBConfig);

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
        <Route path="/initialuser" element={<InitialPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="goal" element={<GoalPage />} />
            <Route path="goal/:id" element={<GoalDetailsPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="importexportdata" element={<ImportExportDataPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          <Route path="/running" element={<RunningPage />} />
          <Route path="activity/:id" element={<ActivityDetailsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
