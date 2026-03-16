import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-gray-800 py-4 px-6 text-center">
        <span className="text-xs text-gray-600 tracking-wide">RepoVision v1.1</span>
      </footer>
    </div>
  );
}
