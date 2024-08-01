import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import AnalysisPage from './pages/AnalysisPage';
import GoalPage from './pages/GoalPage';
import MenuPage from './pages/MenuPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/analysis",
        element: <AnalysisPage />,
      },
      {
        path: "/goal",
        element: <GoalPage />,
      },
      {
        path: "/menu",
        element: <MenuPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
