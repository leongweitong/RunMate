import { HashRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import AnalysisPage from './pages/AnalysisPage';
import GoalPage from './pages/GoalPage';
import MenuPage from './pages/MenuPage';

function App() {
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
      </Routes>
    </HashRouter>
  )
}

export default App
