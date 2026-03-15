import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import HomePage from '../pages/HomePage';
import AnalyzePage from '../pages/AnalyzePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'analyze', element: <AnalyzePage /> },
      { path: 'dashboard/:jobId', element: <DashboardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
