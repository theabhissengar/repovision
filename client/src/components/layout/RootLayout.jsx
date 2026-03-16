import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-600 tracking-wide">RepoVision v1.2</span>
          <nav className="flex items-center gap-4">
            <Link
              to="/about"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              About
            </Link>
            <span className="text-gray-800">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              GitHub Repository
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
