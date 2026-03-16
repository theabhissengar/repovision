import { createBrowserRouter } from 'react-router-dom';
import LandingLayout from '../components/layout/LandingLayout';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import HomePage from '../pages/HomePage';
import AnalyzePage from '../pages/AnalyzePage';
import ComparePage from '../pages/ComparePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import AboutPage from '../pages/AboutPage';

const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      { path: '/',      element: <HomePage /> },
      { path: 'about',  element: <AboutPage /> },
    ],
  },
  {
    element: <WorkspaceLayout />,
    children: [
      { path: 'analyze',          element: <AnalyzePage /> },
      { path: 'compare',          element: <ComparePage /> },
      { path: 'dashboard/:jobId', element: <DashboardPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
