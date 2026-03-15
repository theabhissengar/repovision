import { useParams } from 'react-router-dom';
import AnalysisDashboard from '../features/dashboard/components/AnalysisDashboard';

export default function DashboardPage() {
  const { jobId } = useParams();

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <AnalysisDashboard jobId={jobId} />
    </main>
  );
}
