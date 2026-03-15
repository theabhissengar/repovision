import { useNavigate } from 'react-router-dom';
import RepoForm from '../features/analyzer/components/RepoForm';

export default function HomePage() {
  const navigate = useNavigate();

  function handleSubmit(data) {
    navigate('/analyze', { state: { data } });
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-5xl font-bold text-white">
          GitHub Repo <span className="text-violet-500">Analyzer</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          Paste any public GitHub repository URL and get an instant AI-powered analysis.
        </p>
      </div>
      <RepoForm onSuccess={handleSubmit} />
    </main>
  );
}
