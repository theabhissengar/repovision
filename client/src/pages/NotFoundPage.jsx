import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h2 className="text-6xl font-bold text-violet-500 mb-4">404</h2>
      <p className="text-gray-400 text-lg mb-8">Page not found.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
